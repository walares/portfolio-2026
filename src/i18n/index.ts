import { en } from "./locales/en";
import { es } from "./locales/es";
import { servicePagesEn } from "./servicePages/en";
import { servicePagesEs } from "./servicePages/es";
import type { FaqItem, Locale, LocaleContent } from "./types";
import type { ServiceSlug } from "../data/services";

export type { FaqItem, Locale, LocaleContent, PortfolioCopy, StepCopy, UseCaseCopy } from "./types";

const locales: Record<Locale, LocaleContent> = { es, en };

export const defaultLocale: Locale = "es";

export function getLocaleContent(locale: Locale): LocaleContent {
	return locales[locale];
}

export function getAlternateLocale(locale: Locale): Locale {
	return locale === "es" ? "en" : "es";
}

export function localePath(locale: Locale): string {
	return getLocaleContent(locale).path;
}

export function getServicePageContent(locale: Locale, slug: ServiceSlug) {
	return locale === "es" ? servicePagesEs[slug] : servicePagesEn[slug];
}

export function interpolate(template: string, vars: Record<string, string>): string {
	return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? `{${key}}`);
}

export function getFaqs(content: LocaleContent, email: string): FaqItem[] {
	return content.faqs.map((faq) => ({
		...faq,
		answer: interpolate(faq.answer, { email }),
	}));
}

export function formatSrIntro(content: LocaleContent, site: {
	personName: string;
	legalName: string;
	name: string;
	description: string;
	email: string;
	phoneDisplay: string;
}): string {
	return interpolate(content.srIntro, {
		personName: site.personName,
		legalName: site.legalName,
		name: site.name,
		description: content.description,
		email: site.email,
		phone: site.phoneDisplay,
	});
}

export function formatNavAria(template: string, name: string): string {
	return interpolate(template, { name });
}

export function formatWhatsappPrefill(
	content: LocaleContent,
	site: { personName: string; name: string },
): string {
	return interpolate(content.contact.whatsappPrefill, {
		firstName: site.personName.split(" ")[0] ?? site.personName,
		name: site.name,
	});
}

export { en, es };
