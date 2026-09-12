// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLlmsTxt from 'starlight-llms-txt';
import { docsSidebar, docsRedirects } from './src/data/docs-navigation.mjs';

/**
 * Fails a production build with no PostHog key instead of publishing pages
 * whose analytics silently do nothing — the state archcore.ai shipped in
 * before analytics were wired up properly.
 *
 * `apply: 'build'` keeps `astro dev` unaffected. Astro exposes process.env
 * entries with the PUBLIC_ prefix to the client, so checking process.env here
 * matches exactly what the bundle will end up containing.
 *
 * Set ALLOW_MISSING_ANALYTICS_KEY=1 for a deliberate build without analytics.
 */
function requireAnalyticsKey() {
	return {
		name: 'require-analytics-key',
		apply: 'build',
		config() {
			if (process.env.ALLOW_MISSING_ANALYTICS_KEY === '1') return;
			if (process.env.PUBLIC_POSTHOG_KEY) return;
			throw new Error(
				[
					'PUBLIC_POSTHOG_KEY is not set — refusing to build docs whose analytics',
					'silently do nothing.',
					'',
					'  Local build:  PUBLIC_POSTHOG_KEY=phc_... npm run build (or use .env)',
					'  CI:           set the POSTHOG_KEY repository variable; the deploy',
					'                workflow maps it to PUBLIC_POSTHOG_KEY',
					'',
					'Use the same key as archcore.ai — one PostHog project covers both, and',
					'the shared .archcore.ai cookie is what stitches a visitor moving from',
					'the marketing site into the docs into a single session.',
					'',
					'To build without analytics on purpose, set ALLOW_MISSING_ANALYTICS_KEY=1.',
				].join('\n')
			);
		},
	};
}

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.archcore.ai',
	// Every page is static HTML; keeping whitespace compression explicit means
	// a future Astro default change cannot quietly grow the shipped HTML.
	compressHTML: true,
	vite: {
		plugins: [requireAnalyticsKey()],
	},
	redirects: {
		...docsRedirects,
		'/changelog/': 'https://github.com/archcore-ai/cli/releases',
		'/changelog/001/': 'https://github.com/archcore-ai/cli/releases/tag/v0.0.1',
		'/changelog/010/': 'https://github.com/archcore-ai/cli/releases/tag/v0.1.0',
		'/changelog/012/': 'https://github.com/archcore-ai/cli/releases/tag/v0.1.2',
		'/changelog/014/': 'https://github.com/archcore-ai/cli/releases/tag/v0.1.4',
		'/changelog/022/': 'https://github.com/archcore-ai/cli/releases/tag/v0.2.2',
		'/changelog/034/': 'https://github.com/archcore-ai/cli/releases/tag/v0.3.4',
		'/changelog/037/': 'https://github.com/archcore-ai/cli/releases/tag/v0.3.7',
		'/changelog/040/': 'https://github.com/archcore-ai/cli/releases/tag/v0.4.0',
		'/changelog/0410/': 'https://github.com/archcore-ai/cli/releases/tag/v0.4.10',
		'/changelog/050/': 'https://github.com/archcore-ai/cli/releases/tag/v0.5.0',
		'/changelog/070-cli/': 'https://github.com/archcore-ai/cli/releases/tag/v0.7.0',
		'/changelog/070-plugin/': 'https://github.com/archcore-ai/plugin/releases/tag/v0.7.0',
		'/changelog/073-cli/': 'https://github.com/archcore-ai/cli/releases/tag/v0.7.3',
		'/changelog/074-plugin/': 'https://github.com/archcore-ai/plugin/releases/tag/v0.7.4',
		'/changelog/082-plugin/': 'https://github.com/archcore-ai/plugin/releases/tag/v0.8.2',
		'/changelog/083-cli/': 'https://github.com/archcore-ai/cli/releases/tag/v0.8.3',
	},
	integrations: [
		starlight({
			// Brand suffix for every page title ("CLI Overview — Archcore"),
			// per the "… — Archcore" convention in the shared
			// product/seo-information-architecture. The home page overrides its
			// own full title in index.mdx. This was the lowercase wordmark
			// 'archcore', which is a logo treatment, not an entity name.
			title: 'Archcore',
			titleDelimiter: '—',
			components: {
				SocialIcons: './src/components/HeaderLinks.astro',
				Head: './src/components/Head.astro',
				Hero: './src/components/SplashHeroOverride.astro',
				PageTitle: './src/components/PageTitleOverride.astro',
			},
			plugins: [
				starlightLlmsTxt({
					projectName: 'Archcore',
					description:
						'Archcore is a git-native context layer for AI coding agents, covering spec-driven development and context engineering. Typed markdown documents (specs, architecture decisions, rules, plans) stored in a .archcore/ directory in your repository and served to agents over MCP.',
					promote: ['index', 'start/install', 'start/quick-start', 'start/what-to-expect'],
					customSets: [
						{ label: 'Start', paths: ['index', 'start/**'] },
						{ label: 'Guides', paths: ['guides/**'] },
						{ label: 'CLI', paths: ['cli/**', 'guides/connect-your-agent'] },
						{ label: 'Plugin', paths: ['guides/commands', 'guides/connect-your-agent', 'start/**'] },
						{ label: 'Concepts', paths: ['concepts/**'] },
					],
				}),
			],
			favicon: '/favicon.ico',
			logo: {
				light: './src/assets/logo-light.png',
				dark: './src/assets/logo-dark.png',
				alt: 'archcore logo',
			},
			description:
				'Spec-driven development and context engineering for AI coding agents. Archcore keeps specs, architecture, decisions, rules, and plans as typed markdown documents in your repository, loaded into any MCP agent.',
			head: [
				// Preload critical variable fonts so the browser fetches them
				// in parallel with CSS instead of waiting for @font-face discovery.
				{
					tag: 'link',
					attrs: {
						rel: 'preload',
						href: '/fonts/inter-latin-wght-normal.woff2',
						as: 'font',
						type: 'font/woff2',
						crossorigin: 'anonymous',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'preload',
						href: '/fonts/jetbrains-mono-latin-wght-normal.woff2',
						as: 'font',
						type: 'font/woff2',
						crossorigin: 'anonymous',
					},
				},
				{
					tag: 'meta',
					attrs: { property: 'og:locale', content: 'en_US' },
				},
				{
					tag: 'meta',
					attrs: { property: 'og:type', content: 'website' },
				},
				{
					tag: 'meta',
					attrs: { name: 'twitter:card', content: 'summary_large_image' },
				},
				{
					tag: 'script',
					attrs: { type: 'application/ld+json' },
					content: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'WebSite',
						name: 'Archcore',
						url: 'https://docs.archcore.ai',
						description: 'Archcore is a git-native context layer for AI coding agents. Specs, architecture, decisions, rules, and plans live in Git and are available to agents as they work.',
						publisher: {
							'@type': 'Organization',
							name: 'Archcore',
							url: 'https://archcore.ai',
						},
					}),
				},
			],
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/archcore-ai/plugin' },
				{ icon: 'discord', label: 'Discord', href: 'https://discord.gg/5YC8pdjD' },
				{ icon: 'x.com', label: 'X', href: 'https://x.com/archcore_ai' },
				{ icon: 'telegram', label: 'Telegram', href: 'https://t.me/archcore_ai' },
			],
			customCss: ['./src/styles/custom.css'],
			sidebar: docsSidebar,
		}),
	],
});
