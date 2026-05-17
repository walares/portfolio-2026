import type { APIRoute } from "astro";
import { absoluteUrl } from "../data/site";

export const GET: APIRoute = () => {
	const sitemap = absoluteUrl("/sitemap-index.xml");
	const llms = absoluteUrl("/llms.txt");

	const body = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Sitemap
Sitemap: ${sitemap}

# Resumen legible por modelos de lenguaje (llms.txt)
# https://llmstxt.org/
# LLMS: ${llms}

# Crawlers de IA (permitidos para descubrimiento; ajusta si prefieres bloquear alguno)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: cohere-ai
Allow: /
`.trim();

	return new Response(`${body}\n`, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=86400",
		},
	});
};
