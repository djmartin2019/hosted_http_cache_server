import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const NEEDLE =
    '<!--origin-share-meta--><title>GH Resolver — edge cache lab</title><!--/origin-share-meta-->';

let cachedIndex = null;

function indexPath() {
    return join(process.cwd(), 'frontend', 'dist', 'index.html');
}

export function getIndexBase() {
    if (cachedIndex) return cachedIndex;
    const p = indexPath();
    if (!existsSync(p)) {
        throw new Error(`Missing frontend build at ${p}. Run "cd frontend && npm run build" first.`);
    }
    cachedIndex = readFileSync(p, 'utf8');
    return cachedIndex;
}

/** Escape text inside <title> */
function escTitle(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function escAttr(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * @param {{ title: string, description: string, ogImage: string, canonical: string }} opts
 */
export function getIndexWithMeta(opts) {
    const base = getIndexBase();
    if (!base.includes(NEEDLE)) {
        console.warn('[htmlTemplate] Sentinel not found; serving base index.html');
        return base;
    }
    const injection = `<!--origin-share-meta--><title>${escTitle(opts.title)}</title><!--/origin-share-meta-->
    <link rel="canonical" href="${escAttr(opts.canonical)}" />
    <meta name="description" content="${escAttr(opts.description)}" />
    <meta property="og:title" content="${escAttr(opts.title)}" />
    <meta property="og:description" content="${escAttr(opts.description)}" />
    <meta property="og:image" content="${escAttr(opts.ogImage)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${escAttr(opts.canonical)}" />
    <meta property="og:type" content="profile" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escAttr(opts.title)}" />
    <meta name="twitter:description" content="${escAttr(opts.description)}" />
    <meta name="twitter:image" content="${escAttr(opts.ogImage)}" />`;
    return base.replace(NEEDLE, injection.trim());
}
