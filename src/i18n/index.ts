import { en } from "./locales/en";
import { es } from "./locales/es";
import type { Locale, LocaleContent } from "./types";

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

export function interpolate(template: string, vars: Record<string, string>): string {
	return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? `{${key}}`);
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
