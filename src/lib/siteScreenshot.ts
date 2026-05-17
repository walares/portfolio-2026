/**
 * Captura del sitio vía Microlink (sin branding de WordPress; no implica el CMS del proyecto).
 * @see https://microlink.io/docs/api/parameters/embed
 */
export function siteScreenshotUrl(pageUrl: string) {
	const params = new URLSearchParams({
		url: pageUrl,
		meta: "false",
		screenshot: "true",
		embed: "screenshot.url",
	});
	return `https://api.microlink.io/?${params.toString()}`;
}
