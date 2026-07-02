/**
 * Descarga capturas locales para el portfolio (ejecutar: node scripts/fetch-portfolio-previews.mjs)
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public", "portfolio");

const projects = [
	{ id: "aa01", url: "https://altiplanoheadhunters.com/" },
	{ id: "aa02", url: "https://matifruti.com/" },
	{ id: "aa03", url: "https://giffordlanguages.com/index-es.html" },
	{ id: "aa04", url: "https://english-quotes.vercel.app/" },
	{ id: "aa05", url: "https://sellexauto.com/" },
];

function screenshotUrl(pageUrl) {
	const params = new URLSearchParams({
		url: pageUrl,
		meta: "false",
		screenshot: "true",
		embed: "screenshot.url",
	});
	return `https://api.microlink.io/?${params.toString()}`;
}

await mkdir(outDir, { recursive: true });

for (const project of projects) {
	const target = path.join(outDir, `${project.id}.jpg`);
	process.stdout.write(`Fetching ${project.id}… `);
	try {
		const res = await fetch(screenshotUrl(project.url));
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const buffer = Buffer.from(await res.arrayBuffer());
		await writeFile(target, buffer);
		process.stdout.write("ok\n");
	} catch (error) {
		process.stdout.write(`failed (${error.message})\n`);
	}
}

console.log("Done. Previews saved to public/portfolio/");
