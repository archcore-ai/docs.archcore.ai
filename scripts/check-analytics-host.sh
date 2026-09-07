#!/usr/bin/env bash
#
# Proves that a PostHog host actually reaches PostHog before anything is
# shipped to it.
#
# This exists because of a silent, months-long outage. ph.archcore.ai was a
# Vercel rewrite proxy; the migration to GitHub Pages deleted the Vercel
# project but left vars.POSTHOG_HOST pointing at it, and archcore.ai's
# wildcard DNS record (`* ALIAS cname.vercel-dns-017.com`) kept the name
# resolving. Every request got Vercel's DEPLOYMENT_NOT_FOUND 404, so the
# browser bundle, the content hub and both installers reported nothing at all
# — and nothing failed, anywhere. A dashboard that goes quiet looks exactly
# like a site nobody visits.
#
# The replacement is edge.archcore.ai. ph.archcore.ai is kept alongside it
# only so CLI builds that hardcode it keep reporting until they self-update.
# This script checks whichever host it is handed, so it covers both.
#
# Two probes, because a host can pass one and fail the other:
#
#   GET  /array/<key>/config   the remote config posthog-js fetches on init.
#                              200 plus the analytics endpoint in the body
#                              proves both the path and the project key.
#   POST /i/v0/e/  with `{}`   the ingestion path the bundle and the
#                              installers post to. PostHog answers 400
#                              ("missing event name"), which is the point:
#                              only PostHog's own handler produces it, and
#                              nothing is recorded. A proxy that forwards
#                              /array but not /i/v0/e/ fails here.
#
# Usage:
#   POSTHOG_KEY=phc_… POSTHOG_HOST=https://… [MODE=fail|warn] [LABEL=…] \
#     scripts/check-analytics-host.sh

set -euo pipefail

MODE="${MODE:-fail}"
LABEL="${LABEL:-$POSTHOG_HOST}"

# ::error:: fails the job through the shell exit below; ::warning:: is for
# hosts that are known-broken and being restored, so the annotation is visible
# without blocking every deploy until DNS is fixed.
level="error"
[ "$MODE" = "warn" ] && level="warning"

fail() {
  echo "::${level}::analytics host ${LABEL} (${POSTHOG_HOST}) is not reaching PostHog — $1"
  [ "$MODE" = "warn" ] && exit 0
  exit 1
}

case "${POSTHOG_KEY:-}" in
  phc_*) ;;
  *) echo "::error::POSTHOG_KEY is not a PostHog project key (expected a phc_ prefix)"; exit 1 ;;
esac

# --max-time keeps a hung proxy from holding the job for the full step timeout.
config="$(curl -sS --max-time 20 -w '\n%{http_code}' "${POSTHOG_HOST}/array/${POSTHOG_KEY}/config" || true)"
config_status="$(printf '%s' "$config" | tail -n1)"
config_body="$(printf '%s' "$config" | sed '$d')"

[ "$config_status" = "200" ] || fail "GET /array/<key>/config returned ${config_status:-no response}: $(printf '%s' "$config_body" | head -c 200)"

case "$config_body" in
  *'"endpoint":"/i/v0/e/"'*) ;;
  *) fail "GET /array/<key>/config returned 200 but not PostHog's config JSON: $(printf '%s' "$config_body" | head -c 200)" ;;
esac

ingest_status="$(curl -sS --max-time 20 -o /dev/null -w '%{http_code}' \
  -X POST "${POSTHOG_HOST}/i/v0/e/" \
  -H 'content-type: application/json' -d '{}' || true)"

# 400 is the expected answer to a deliberately empty payload. Anything in the
# 2xx range would also mean the path is live, so both are accepted rather than
# pinning the check to one status PostHog is free to change.
case "$ingest_status" in
  400|2??) ;;
  *) fail "POST /i/v0/e/ returned ${ingest_status:-no response}, expected 400 for an empty payload" ;;
esac

echo "analytics host ${LABEL} (${POSTHOG_HOST}) reaches PostHog: config 200, ingest ${ingest_status}"
