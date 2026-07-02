import { portfolioProjects } from "../data/portfolio";
import { absoluteUrl, site } from "../data/site";
import {
	defaultLocale,
	getAlternateLocale,
	getLocaleContent,
	localePath,
	type Locale,
} from "../i18n";

export type SeoProps = {
	locale?: Locale;
	title?: string;
	description?: string;
	path?: string;
	noindex?: boolean;
	ogImagePath?: string;
};

export function resolveSeo({
	locale = defaultLocale,
	title,
	description,
	path,
	noindex = false,
	ogImagePath = site.ogImagePath,
}: SeoProps = {}) {
	const content = getLocaleContent(locale);
	const pagePath = path ?? content.path;
	const canonical = absoluteUrl(pagePath);
	const ogImage = absoluteUrl(ogImagePath);

	return {
		title: title ?? content.title,
		description: description ?? content.description,
		canonical,
		ogImage,
		noindex,
		locale,
		hreflang: content.hreflang,
		language: content.language,
	};
}

export function buildJsonLd(locale: Locale = defaultLocale, path?: string) {
	const content = getLocaleContent(locale);
	const pagePath = path ?? content.path;
	const pageUrl = absoluteUrl(pagePath);
	const ogImage = absoluteUrl(site.ogImagePath);
	const sameAs = [...site.socialProfiles];
	const countryName = locale === "en" ? site.location.countryEn : site.location.country;

	const webSite = {
		"@type": "WebSite",
		"@id": `${site.url}/#website`,
		url: site.url,
		name: site.name,
		description: content.description,
		inLanguage: content.language,
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
		description: content.description,
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
			latitude: site.location.latitude,
			longitude: site.location.longitude,
			addressCountry: site.location.countryCode,
		},
		knowsAbout: [...site.technologies, ...content.services],
		...(sameAs.length > 0 ? { sameAs } : {}),
	};

	const person = {
		"@type": "Person",
		"@id": `${site.url}/#person`,
		name: site.personName,
		jobTitle: content.jobTitle,
		worksFor: { "@id": `${site.url}/#organization` },
		url: pageUrl,
		email: site.email,
		telephone: site.phoneDisplay,
		...(sameAs.length > 0 ? { sameAs } : {}),
	};

	const webPage = {
		"@type": "WebPage",
		"@id": `${pageUrl}#webpage`,
		url: pageUrl,
		name: content.title,
		description: content.description,
		isPartOf: { "@id": `${site.url}/#website` },
		about: { "@id": `${site.url}/#organization` },
		inLanguage: content.language,
		dateModified: new Date().toISOString().slice(0, 10),
	};

	const serviceNodes = content.services.map((name, index) => ({
		"@type": "Service",
		"@id": `${site.url}/#service-${content.language}-${index + 1}`,
		name,
		provider: { "@id": `${site.url}/#organization` },
		areaServed: ["PE", "LATAM"],
	}));

	const workList = {
		"@type": "ItemList",
		"@id": `${site.url}/#portfolio-${content.language}`,
		name: content.portfolioSection.heading + content.portfolioSection.headingMuted,
		itemListElement: portfolioProjects.map((project, index) => {
			const copy = content.portfolioSection.projects[project.id];
			return {
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "CreativeWork",
					name: project.title,
					description: copy?.description ?? project.description,
					url: project.url,
					dateCreated: project.year,
					keywords: (copy?.tags ?? project.tags).join(", "),
				},
			};
		}),
	};

	const faqPage = {
		"@type": "FAQPage",
		"@id": `${pageUrl}#faq`,
		mainEntity: content.faqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.answer,
			},
		})),
	};

	return {
		"@context": "https://schema.org",
		"@graph": [webSite, organization, person, webPage, ...serviceNodes, workList, faqPage],
	};
}

export function buildLlmsTxt(full = false, locale: Locale = defaultLocale): string {
	const content = getLocaleContent(locale);
	const alternate = getAlternateLocale(locale);
	const alternatePath = localePath(alternate);
	const countryName = locale === "en" ? site.location.countryEn : site.location.country;
	const remoteNote = locale === "en" ? "remote work across LATAM" : "trabajo remoto LATAM";
	const languageLabel =
		locale === "en" ? `English (${content.locale})` : `español (${content.locale})`;

	const lines: string[] = [
		`# ${site.personName} — ${site.name}`,
		"",
		`> ${content.description}`,
		"",
		`${content.llms.officialSite}: ${absoluteUrl(content.path)}`,
		`${content.llms.language}: ${languageLabel}`,
		`${content.llms.location}: ${site.location.city}, ${countryName} (${remoteNote})`,
		"",
	];

	if (full) {
		lines.push(
			`## ${content.llms.aiSummary}`,
			"",
			content.audience,
			"",
			content.tagline,
			"",
		);
	}

	lines.push(`## ${content.llms.services}`, "", ...content.services.map((s) => `- ${s}`), "", `## ${content.llms.faqs}`, "");

	for (const faq of content.faqs) {
		lines.push(`### ${faq.question}`, "", faq.answer, "");
	}

	lines.push(`## ${content.llms.capabilities}`, "", ...content.llms.capabilityItems.map((item) => `- ${item}`), "");

	lines.push("", `## ${content.llms.stack}`, "", ...site.technologies.map((t) => `- ${t}`), "", `## ${content.llms.projects}`, "");

	for (const project of portfolioProjects) {
		const copy = content.portfolioSection.projects[project.id];
		lines.push(
			`### ${project.title} (${project.year})`,
			`- ${content.llms.urlLabel}: ${project.url}`,
			`- ${copy?.description ?? project.description}`,
			`- ${content.llms.tagsLabel}: ${(copy?.tags ?? project.tags).join(", ")}`,
			"",
		);
	}

	lines.push(
		`## ${content.llms.contact}`,
		"",
		`- Email: ${site.email}`,
		`- WhatsApp: ${site.phoneDisplay} (https://wa.me/${site.phoneE164})`,
		`- ${content.llms.formLink}: ${absoluteUrl(content.path)}#contacto`,
		"",
		`## ${content.llms.keywords}`,
		"",
		content.keywords.join(", "),
		"",
		locale === "es"
			? `English version: ${absoluteUrl(alternatePath)}`
			: `Versión en español: ${absoluteUrl(alternatePath)}`,
		"",
	);

	if (full) {
		lines.push(
			`## ${content.llms.usefulLinks}`,
			"",
			`- ${content.llms.shortSummary}: ${absoluteUrl("/llms.txt")}`,
			`- ${content.llms.extendedVersion}: ${absoluteUrl("/llms-full.txt")}`,
			`- ${content.llms.sitemap}: ${absoluteUrl("/sitemap-index.xml")}`,
			"",
		);
	}

	return lines.join("\n").trimEnd() + "\n";
}

export function getHreflangAlternates(currentPath: string) {
	return {
		es: absoluteUrl(currentPath === "/en/" ? "/" : "/"),
		en: absoluteUrl("/en/"),
		default: absoluteUrl("/"),
	};
}
