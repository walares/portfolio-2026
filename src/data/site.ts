/** Configuración global del sitio: SEO, contacto y descubrimiento por IA. */
export const site = {
	name: "AE Webdes",
	brandShort: "AA. Webdes",
	legalName: "Alejandro Arango Web Design",
	personName: "Alejandro Arango",
	tagline: "Webs rápidas. Procesos amigables. Listas para crecer.",
	title: "Alejandro Arango — Diseño y desarrollo web | AE Webdes",
	description:
		"Diseño UI/UX, desarrollo a medida y WordPress en Lima y de forma remota. Webs rápidas, SEO técnico y conversión: landings, webs corporativas, e-commerce y productos digitales.",
	url: (import.meta.env.PUBLIC_SITE_URL as string | undefined)?.replace(/\/$/, "") || "https://aewebdes.com",
	locale: "es_PE",
	language: "es",
	email: "contacto@aewebdes.com",
	phoneDisplay: "+51 978 350 997",
	phoneE164: "51978350997",
	location: {
		city: "Lima",
		region: "Lima",
		country: "Perú",
		countryCode: "PE",
	},
	/** Logo de marca en /public (cuadrado, fondo oscuro). */
	logoPath: "/logo-ae.png",
	/** Ruta en /public (recomendado: 1200×630 JPG o PNG). */
	ogImagePath: "/og-image.svg",
	keywords: [
		"diseño web",
		"desarrollo web",
		"WordPress",
		"UI/UX",
		"SEO técnico",
		"landing page",
		"e-commerce",
		"web corporativa",
		"Astro",
		"React",
		"Lima",
		"Perú",
		"Alejandro Arango",
		"AE Webdes",
		"aewebdes",
	],
	services: [
		"Landing pages de conversión",
		"Webs corporativas",
		"Tiendas online y e-commerce (WordPress)",
		"Productos digitales a medida (React, cotizadores, dashboards)",
	],
	technologies: ["Astro", "React", "WordPress", "Tailwind CSS", "TypeScript"],
	audience:
		"Empresas y equipos en Perú y Latinoamérica que necesitan presencia web profesional, rendimiento y contacto directo con clientes.",
} as const;

export function absoluteUrl(path = "/"): string {
	const base = site.url.endsWith("/") ? site.url.slice(0, -1) : site.url;
	if (!path || path === "/") return `${base}/`;
	return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
