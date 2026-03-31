// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.archcore.ai',
	redirects: {
		'/getting-started/installation/': '/start/quick-start/',
		'/getting-started/quick-start/': '/start/quick-start/',
		'/getting-started/first-10-minutes/': '/start/quick-start/',
		'/getting-started/why-not-flat-files/': '/start/vs-flat-files/',
		'/concepts/philosophy/': '/concepts/how-it-works/',
		'/concepts/context-layers/': '/concepts/how-it-works/',
		'/concepts/directory-structure/': '/concepts/documents/',
		'/use-cases/architecture-decisions/': '/concepts/use-cases/',
		'/use-cases/coding-rules/': '/concepts/use-cases/',
		'/use-cases/shared-project-memory/': '/concepts/use-cases/',
		'/use-cases/implementation-plans/': '/concepts/use-cases/',
		'/integrations/mcp-server/': '/agents/mcp-server/',
		'/integrations/supported-agents/': '/agents/supported-agents/',
		'/integrations/hooks/': '/agents/mcp-server/',
		'/reference/cli-commands/': '/agents/cli/',
		'/troubleshooting/agent-not-seeing-documents/': '/reference/troubleshooting/',
		'/troubleshooting/mcp-not-starting/': '/reference/troubleshooting/',
		'/troubleshooting/validation-errors/': '/reference/troubleshooting/',
	},
	integrations: [
		starlight({
			title: 'archcore',
			components: {
				SocialIcons: './src/components/HeaderLinks.astro',
			},
			favicon: '/favicon.ico',
			logo: {
				light: './src/assets/logo-light.png',
				dark: './src/assets/logo-dark.png',
				alt: 'archcore logo',
			},
			description: 'Git-native context for AI coding agents. Context engineering for repositories.',
			head: [
				{
					tag: 'meta',
					attrs: { property: 'og:image', content: 'https://docs.archcore.ai/og-image.png' },
				},
				{
					tag: 'meta',
					attrs: { property: 'og:image:width', content: '1200' },
				},
				{
					tag: 'meta',
					attrs: { property: 'og:image:height', content: '630' },
				},
				{
					tag: 'meta',
					attrs: { property: 'og:image:type', content: 'image/png' },
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
					attrs: { property: 'og:title', content: 'archcore — Git-native context for AI coding agents' },
				},
				{
					tag: 'meta',
					attrs: { property: 'og:description', content: 'Git-native context for AI coding agents. Context engineering for repositories.' },
				},
				{
					tag: 'meta',
					attrs: { name: 'twitter:card', content: 'summary_large_image' },
				},
				{
					tag: 'meta',
					attrs: { name: 'twitter:title', content: 'archcore — Git-native context for AI coding agents' },
				},
				{
					tag: 'meta',
					attrs: { name: 'twitter:description', content: 'Git-native context for AI coding agents. Context engineering for repositories.' },
				},
				{
					tag: 'meta',
					attrs: { name: 'twitter:image', content: 'https://docs.archcore.ai/og-image.png' },
				},
				{
					tag: 'script',
					attrs: { type: 'application/ld+json' },
					content: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'WebSite',
						name: 'Archcore',
						url: 'https://docs.archcore.ai',
						description: 'Git-native context for AI coding agents. Context engineering for repositories.',
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
					label: 'Get Started',
					items: [
						{ label: 'Introduction', slug: '' },
						{ label: 'Quick Start', slug: 'start/quick-start' },
						{ label: 'Flat Files vs Archcore', slug: 'start/vs-flat-files' },
					],
				},
				{
					label: 'Concepts',
					items: [
						{ label: 'How It Works', slug: 'concepts/how-it-works' },
						{ label: 'Document Types', slug: 'concepts/document-types' },
						{ label: 'Documents & Layout', slug: 'concepts/documents' },
						{ label: 'Relations', slug: 'concepts/relations' },
						{ label: 'Use Cases', slug: 'concepts/use-cases' },
					],
				},
				{
					label: 'Agents & Tools',
					items: [
						{ label: 'Supported Agents', slug: 'agents/supported-agents' },
						{ label: 'MCP Server', slug: 'agents/mcp-server' },
						{ label: 'CLI Commands', slug: 'agents/cli' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'MCP Tools', slug: 'reference/mcp-tools' },
						{ label: 'Configuration', slug: 'reference/configuration' },
						{ label: 'Document Format', slug: 'reference/document-format' },
						{ label: 'Troubleshooting', slug: 'reference/troubleshooting' },
					],
				},
			],
		}),
	],
});
