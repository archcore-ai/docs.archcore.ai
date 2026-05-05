// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.archcore.ai',
	redirects: {
		// Legacy paths
		'/getting-started/installation/': '/cli/install/',
		'/getting-started/quick-start/': '/start/plugin-quick-start/',
		'/getting-started/first-10-minutes/': '/start/plugin-quick-start/',
		'/getting-started/why-not-flat-files/': '/concepts/vs-flat-files/',
		'/concepts/philosophy/': '/concepts/how-it-works/',
		'/concepts/context-layers/': '/concepts/how-it-works/',
		'/concepts/directory-structure/': '/concepts/documents/',
		'/use-cases/architecture-decisions/': '/concepts/use-cases/',
		'/use-cases/coding-rules/': '/concepts/use-cases/',
		'/use-cases/shared-project-memory/': '/concepts/use-cases/',
		'/use-cases/implementation-plans/': '/concepts/use-cases/',
		'/integrations/mcp-server/': '/cli/mcp-server/',
		'/integrations/supported-agents/': '/cli/agent-integrations/',
		'/integrations/hooks/': '/cli/hooks/',
		'/reference/cli-commands/': '/cli/commands/',
		'/troubleshooting/agent-not-seeing-documents/': '/cli/troubleshooting/',
		'/troubleshooting/mcp-not-starting/': '/cli/troubleshooting/',
		'/troubleshooting/validation-errors/': '/cli/troubleshooting/',

		// IA restructure — Get Started group retired in favor of path-based layout
		'/start/quick-start/': '/start/plugin-quick-start/',
		'/start/vs-flat-files/': '/concepts/vs-flat-files/',

		// Former "Agents & Tools" group folded under /cli/
		'/agents/supported-agents/': '/cli/agent-integrations/',
		'/agents/mcp-server/': '/cli/mcp-server/',
		'/agents/cli/': '/cli/commands/',

		// CLI-specific reference pages moved under /cli/
		'/reference/configuration/': '/cli/configuration/',
		'/reference/troubleshooting/': '/cli/troubleshooting/',

		// Plugin Skills consolidation — Intent Commands and Tracks merged into Skills
		'/plugin/intent-commands/': '/plugin/skills/#intent-commands',
		'/plugin/tracks/': '/plugin/skills/#tracks',
	},
	integrations: [
		starlight({
			title: 'archcore',
			components: {
				SocialIcons: './src/components/HeaderLinks.astro',
				Head: './src/components/Head.astro',
				Hero: './src/components/SplashHeroOverride.astro',
				PageTitle: './src/components/PageTitleOverride.astro',
			},
			favicon: '/favicon.ico',
			logo: {
				light: './src/assets/logo-light.png',
				dark: './src/assets/logo-dark.png',
				alt: 'archcore logo',
			},
			description: 'Archcore turns your repository into structured, machine-readable context — so AI agents understand your architecture, rules, and decisions.',
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
						description: 'Archcore turns your repository into structured, machine-readable context — so AI agents understand your architecture, rules, and decisions.',
						publisher: {
							'@type': 'Organization',
							name: 'Archcore',
							url: 'https://archcore.ai',
						},
					}),
				},
			],
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/archcore-ai/cli' },
				{ icon: 'discord', label: 'Discord', href: 'https://discord.gg/5YC8pdjD' },
				{ icon: 'x.com', label: 'X', href: 'https://x.com/archcore_ai' },
				{ icon: 'telegram', label: 'Telegram', href: 'https://t.me/archcore_ai' },
			],
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{
					label: 'Start Here',
					items: [
						{ label: 'Overview', slug: '' },
						{ label: 'Choose Plugin or CLI', slug: 'start/choose' },
						{ label: 'Plugin Quick Start', slug: 'start/plugin-quick-start' },
						{ label: 'CLI Quick Start', slug: 'cli/quick-start' },
						{ label: 'Migrate from Flat Files', slug: 'start/migrate-from-flat-files' },
					],
				},
				{
					label: 'Plugin',
					items: [
						{ label: 'Overview', slug: 'plugin/overview' },
						{ label: 'Install', slug: 'plugin/install' },
						{ label: 'Supported Hosts', slug: 'plugin/supported-hosts' },
						{ label: 'How Plugin Works', slug: 'plugin/how-it-works' },
						{ label: 'Skills', slug: 'plugin/skills' },
						{ label: 'Built-in Agents', slug: 'plugin/agents' },
						{ label: 'Troubleshooting', slug: 'plugin/troubleshooting' },
					],
				},
				{
					label: 'CLI',
					items: [
						{ label: 'Overview', slug: 'cli/overview' },
						{ label: 'Install', slug: 'cli/install' },
						{ label: 'Quick Start', slug: 'cli/quick-start' },
						{ label: 'archcore init', slug: 'cli/init' },
						{ label: 'Commands', slug: 'cli/commands' },
						{ label: 'MCP Server', slug: 'cli/mcp-server' },
						{ label: 'Hooks', slug: 'cli/hooks' },
						{ label: 'Agent Integrations', slug: 'cli/agent-integrations' },
						{ label: 'Configuration', slug: 'cli/configuration' },
						{ label: 'Troubleshooting', slug: 'cli/troubleshooting' },
					],
				},
				{
					label: 'Concepts',
					items: [
						{ label: 'What Is Archcore?', slug: 'concepts/what-is-archcore' },
						{ label: 'Mental Model', slug: 'concepts/mental-model' },
						{ label: 'How It Works', slug: 'concepts/how-it-works' },
						{ label: 'Document Types', slug: 'concepts/document-types' },
						{ label: 'Documents & Layout', slug: 'concepts/documents' },
						{ label: 'Relations', slug: 'concepts/relations' },
						{ label: 'Flat Files vs Archcore', slug: 'concepts/vs-flat-files' },
						{ label: 'Use Cases', slug: 'concepts/use-cases' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Document Format', slug: 'reference/document-format' },
						{ label: 'MCP Tools', slug: 'reference/mcp-tools' },
						{ label: 'MCP Prompts', slug: 'reference/mcp-prompts' },
						{ label: 'Plugin Skills', slug: 'reference/skills' },
						{ label: 'Tracks', slug: 'reference/tracks' },
					],
				},
			],
		}),
	],
});
