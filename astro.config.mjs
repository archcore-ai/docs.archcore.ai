// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.archcore.ai',
	redirects: {
		'/getting-started/installation/': '/getting-started/quick-start/',
		'/concepts/how-it-works/': '/concepts/philosophy/',
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
			description: 'System Context Platform — keeps humans and AI in sync with your system',
			head: [
				{
					tag: 'meta',
					attrs: { property: 'og:image', content: 'https://docs.archcore.ai/og-image.png' },
				},
				{
					tag: 'script',
					attrs: { type: 'application/ld+json' },
					content: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'WebSite',
						name: 'Archcore',
						url: 'https://docs.archcore.ai',
						description: 'System Context Platform — keeps humans and AI in sync with your system',
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
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: '' },
						{ label: 'Quick Start', slug: 'getting-started/quick-start' },
					],
				},
				{
					label: 'Core Concepts',
					items: [
						{ label: 'Philosophy', slug: 'concepts/philosophy' },
						{ label: 'Context Layers', slug: 'concepts/context-layers' },
						{ label: 'Document Types', slug: 'concepts/document-types' },
						{ label: 'Directory Structure', slug: 'concepts/directory-structure' },
						{ label: 'Relations', slug: 'concepts/relations' },
					],
				},
				{
					label: 'Integrations',
					items: [
						{ label: 'MCP Server', slug: 'integrations/mcp-server' },
						{ label: 'Supported Agents', slug: 'integrations/supported-agents' },
						{ label: 'Hooks', slug: 'integrations/hooks' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'CLI Commands', slug: 'reference/cli-commands' },
						{ label: 'Document Format', slug: 'reference/document-format' },
						{ label: 'Configuration', slug: 'reference/configuration' },
						{ label: 'MCP Tools', slug: 'reference/mcp-tools' },
					],
				},
			],
		}),
	],
});
