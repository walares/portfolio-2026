/** Slugs de páginas de servicio (ES ↔ EN). */
export const serviceSlugs = [
	"landing-page-conversion",
	"diseno-web-lima",
	"tienda-online-wordpress",
	"producto-digital",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

export const serviceSlugMap: Record<ServiceSlug, { es: string; en: string }> = {
	"landing-page-conversion": {
		es: "landing-page-conversion",
		en: "conversion-landing-page",
	},
	"diseno-web-lima": {
		es: "diseno-web-lima",
		en: "web-design-lima",
	},
	"tienda-online-wordpress": {
		es: "tienda-online-wordpress",
		en: "wordpress-online-store",
	},
	"producto-digital": {
		es: "producto-digital",
		en: "custom-digital-product",
	},
};

export function servicePath(locale: "es" | "en", slug: ServiceSlug): string {
	const segment = serviceSlugMap[slug][locale];
	return locale === "es" ? `/servicios/${segment}/` : `/en/services/${segment}/`;
}

export function resolveServiceSlugFromPath(pathname: string): ServiceSlug | null {
	const normalized = pathname.replace(/\/$/, "");
	for (const slug of serviceSlugs) {
		const esPath = `/servicios/${serviceSlugMap[slug].es}`;
		const enPath = `/en/services/${serviceSlugMap[slug].en}`;
		if (normalized === esPath || normalized === enPath) return slug;
	}
	return null;
}

export function alternateServicePath(currentPathname: string): string | null {
	const slug = resolveServiceSlugFromPath(currentPathname);
	if (!slug) return null;
	const isEnglish = currentPathname.startsWith("/en/");
	return servicePath(isEnglish ? "es" : "en", slug);
}

/** Índice de tarjeta en servicesSection.useCases → slug de página. */
export const useCaseServiceSlugs: ServiceSlug[] = [
	"landing-page-conversion",
	"diseno-web-lima",
	"tienda-online-wordpress",
	"producto-digital",
];
