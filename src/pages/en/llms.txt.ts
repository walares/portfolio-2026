import type { APIRoute } from "astro";
import { buildLlmsTxt } from "../../lib/seo";

export const GET: APIRoute = () =>
	new Response(buildLlmsTxt(false, "en"), {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});