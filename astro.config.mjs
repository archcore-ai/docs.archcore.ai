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
			description: 'Shared architectural memory for AI coding agents',
			head: [
				{
					tag: 'meta',
					attrs: { property: 'og:image', content: 'https://docs.archcore.ai/og-image.png' },
				},
				{
					tag: 'meta',
					attrs: { property: 'og:type', content: 'website' },
				},
				{
					tag: 'script',
					attrs: { type: 'application/ld+json' },
					content: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'WebSite',
						name: 'Archcore',
						url: 'https://docs.archcore.ai',
						description: 'Shared architectural memory for AI coding agents',
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
						{ label: 'What Is Archcore?', slug: '' },
						{ label: 'Quick Start', slug: 'getting-started/quick-start' },
						{ label: 'First 10 Minutes', slug: 'getting-started/first-10-minutes' },
						{ label: 'Why Not Flat Files?', slug: 'getting-started/why-not-flat-files' },
					],
				},
				{
					label: 'Concepts',
					items: [
						{ label: 'Philosophy', slug: 'concepts/philosophy' },
						{ label: 'Context Layers', slug: 'concepts/context-layers' },
						{ label: 'Document Types', slug: 'concepts/document-types' },
						{ label: 'Directory Structure', slug: 'concepts/directory-structure' },
						{ label: 'Relations', slug: 'concepts/relations' },
					],
				},
				{
					label: 'Use Cases',
					items: [
						{ label: 'Capture Architecture Decisions', slug: 'use-cases/architecture-decisions' },
						{ label: 'Keep Coding Rules Reusable', slug: 'use-cases/coding-rules' },
						{ label: 'Build Shared Project Memory', slug: 'use-cases/shared-project-memory' },
						{ label: 'Plan Implementation Work', slug: 'use-cases/implementation-plans' },
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
				{
					label: 'Troubleshooting',
					items: [
						{ label: 'Agent Cannot See Documents', slug: 'troubleshooting/agent-not-seeing-documents' },
						{ label: 'MCP Server Not Starting', slug: 'troubleshooting/mcp-not-starting' },
						{ label: 'Validation Errors', slug: 'troubleshooting/validation-errors' },
					],
				},
			],
		}),
	],
});
