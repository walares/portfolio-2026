import { portfolioProjects } from "../data/portfolio";
import { absoluteUrl, site } from "../data/site";

export type SeoProps = {
	title?: string;
	description?: string;
	path?: string;
	noindex?: boolean;
	ogImagePath?: string;
};

export function resolveSeo({
	title = site.title,
	description = site.description,
	path = "/",
	noindex = false,
	ogImagePath = site.ogImagePath,
}: SeoProps = {}) {
	const canonical = absoluteUrl(path);
	const ogImage = absoluteUrl(ogImagePath);

	return {
		title,
		description,
		canonical,
		ogImage,
		noindex,
	};
}

export function buildJsonLd(path = "/") {
	const pageUrl = absoluteUrl(path);
	const ogImage = absoluteUrl(site.ogImagePath);

	const webSite = {
		"@type": "WebSite",
		"@id": `${site.url}/#website`,
		url: site.url,
		name: site.name,
		description: site.description,
		inLanguage: site.language,
		publisher: { "@id": `${site.url}/#organization` },
	};

	const logoUrl = absoluteUrl(site.logoPath);

	const organization = {
		"@type": "ProfessionalService",
		"@id": `${site.url}/#organization`,
		name: site.name,
		legalName: site.legalName,
		url: site.url,
		logo: logoUrl,
		image: ogImage,
		description: site.description,
		email: site.email,
		telephone: site.phoneDisplay,
		areaServed: ["PE", "LATAM"],
		address: {
			"@type": "PostalAddress",
			addressLocality: site.location.city,
			addressRegion: site.location.region,
			addressCountry: site.location.countryCode,
		},
		geo: {
			"@type": "GeoCoordinates",
			addressCountry: site.location.countryCode,
		},
		knowsAbout: [...site.technologies, ...site.services],
		sameAs: [] as string[],
	};

	const person = {
		"@type": "Person",
		"@id": `${site.url}/#person`,
		name: site.personName,
		jobTitle: "Diseñador y desarrollador web",
		worksFor: { "@id": `${site.url}/#organization` },
		url: pageUrl,
		email: site.email,
		telephone: site.phoneDisplay,
	};

	const webPage = {
		"@type": "WebPage",
		"@id": `${pageUrl}#webpage`,
		url: pageUrl,
		name: site.title,
		description: site.description,
		isPartOf: { "@id": `${site.url}/#website` },
		about: { "@id": `${site.url}/#organization` },
		inLanguage: site.language,
	};

	const workList = {
		"@type": "ItemList",
		"@id": `${site.url}/#portfolio`,
		name: "Proyectos destacados",
		itemListElement: portfolioProjects.map((project, index) => ({
			"@type": "ListItem",
			position: index + 1,
			item: {
				"@type": "CreativeWork",
				name: project.title,
				description: project.description,
				url: project.url,
				dateCreated: project.year,
				keywords: project.tags.join(", "),
			},
		})),
	};

	return {
		"@context": "https://schema.org",
		"@graph": [webSite, organization, person, webPage, workList],
	};
}

export function buildLlmsTxt(full = false): string {
	const lines: string[] = [
		`# ${site.personName} — ${site.name}`,
		"",
		`> ${site.description}`,
		"",
		`Sitio oficial: ${site.url}`,
		`Idioma: español (${site.locale})`,
		`Ubicación: ${site.location.city}, ${site.location.country} (trabajo remoto LATAM)`,
		"",
	];

	if (full) {
		lines.push(
			"## Resumen para asistentes de IA",
			"",
			site.audience,
			"",
			site.tagline,
			"",
		);
	}

	lines.push(
		"## Servicios",
		"",
		...site.services.map((s) => `- ${s}`),
		"",
		"## Capacidades",
		"",
		"- Rendimiento y Core Web Vitals",
		"- Diseño UI/UX y sistemas modulares",
		"- SEO técnico: semántica, metadatos, datos estructurados",
		"- WordPress, Astro y React",
		"",
		"## Stack habitual",
		"",
		...site.technologies.map((t) => `- ${t}`),
		"",
		"## Proyectos publicados",
		"",
	);

	for (const project of portfolioProjects) {
		lines.push(
			`### ${project.title} (${project.year})`,
			`- URL: ${project.url}`,
			`- ${project.description}`,
			`- Etiquetas: ${project.tags.join(", ")}`,
			"",
		);
	}

	lines.push(
		"## Contacto",
		"",
		`- Email: ${site.email}`,
		`- WhatsApp: ${site.phoneDisplay} (https://wa.me/${site.phoneE164})`,
		`- Formulario en la web: ${absoluteUrl("/")}#contacto`,
		"",
		"## Palabras clave",
		"",
		site.keywords.join(", "),
		"",
	);

	if (full) {
		lines.push(
			"## Enlaces útiles",
			"",
			`- Resumen corto (llms.txt): ${absoluteUrl("/llms.txt")}`,
			`- Versión extendida: ${absoluteUrl("/llms-full.txt")}`,
			`- Sitemap: ${absoluteUrl("/sitemap-index.xml")}`,
			"",
		);
	}

	return lines.join("\n").trimEnd() + "\n";
}
