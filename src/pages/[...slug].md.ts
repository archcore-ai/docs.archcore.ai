import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
// ponytail: internal module of starlight-llms-txt (its package exports only the plugin),
// reused so each page's Markdown matches llms-full.txt. A plugin upgrade that moves it fails the build.
import { entryToSimpleMarkdown } from '../../node_modules/starlight-llms-txt/entryToSimpleMarkdown';

export const prerender = true;

// /start/install/ is served as /start/install.md, the root page as /index.md.
export const getStaticPaths = (async () => {
	const docs = await getCollection('docs', doc => !doc.data.draft);
	return docs.map(doc => ({ params: { slug: doc.id }, props: { doc } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ doc: CollectionEntry<'docs'> }> = async context => {
	const { doc } = context.props;
	const title = doc.data.hero?.title || doc.data.title;
	const description = doc.data.hero?.tagline || doc.data.description;
	const body = await entryToSimpleMarkdown(doc, context);
	const text = [`# ${title}`, description && `> ${description}`, body].filter(Boolean).join('\n\n');
	return new Response(text + '\n', { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
