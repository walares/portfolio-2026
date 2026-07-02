/** Configuración global del sitio (independiente del idioma). */
export const site = {
	name: "AE Webdes",
	brandShort: "AA. Webdes",
	legalName: "Alejandro Arango Web Design",
	personName: "Alejandro Arango",
	url: (import.meta.env.PUBLIC_SITE_URL as string | undefined)?.replace(/\/$/, "") || "https://aewebdes.com",
	email: "ae.webdes@gmail.com",
	phoneDisplay: "+51 978 350 997",
	phoneE164: "51978350997",
	location: {
		city: "Lima",
		region: "Lima",
		country: "Perú",
		countryEn: "Peru",
		countryCode: "PE",
		geoRegion: "PE-LIM",
		latitude: -12.0464,
		longitude: -77.0428,
	},
	socialProfiles: ["https://www.linkedin.com/in/alejandro-arango-escobar/"] as readonly string[],
	twitterHandle: "" as string,
	logoPath: "/logo-ae.png",
	ogImagePath: "/og-image.jpg",
	ogImageWidth: 1200,
	ogImageHeight: 630,
	technologies: ["Astro", "React", "WordPress", "Tailwind CSS", "TypeScript"],
} as const;

export function absoluteUrl(path = "/"): string {
	const base = site.url.endsWith("/") ? site.url.slice(0, -1) : site.url;
	if (!path || path === "/") return `${base}/`;
	return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
