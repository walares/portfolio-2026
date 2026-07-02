export type Locale = "es" | "en";

export type FaqItem = {
	question: string;
	answer: string;
};

export type StatItem = {
	value: string;
	label: string;
};

export type PortfolioCopy = {
	description: string;
	tags: string[];
	imageAlt: string;
};

export type UseCaseCopy = {
	title: string;
	body: string;
};

export type StepCopy = {
	title: string;
	tag: string;
	body: string;
};

export type LocaleContent = {
	locale: string;
	language: string;
	hreflang: string;
	path: string;
	pathPrefix: "" | "/en";
	switchLabel: string;
	switchAria: string;
	title: string;
	description: string;
	keywords: readonly string[];
	tagline: string;
	heroHeadline: string;
	heroHeadlineAccent: string;
	heroBody: string;
	audience: string;
	services: readonly string[];
	faqs: readonly FaqItem[];
	jobTitle: string;
	skipLink: string;
	srIntro: string;
	nav: {
		home: string;
		about: string;
		services: string;
		work: string;
		contact: string;
		homeAria: string;
		desktopNavAria: string;
		cta: string;
		menu: string;
		openMenuAria: string;
	};
	aboutSection: {
		eyebrow: string;
		heading: string;
		headingAccent: string;
		bio: string;
		stats: readonly StatItem[];
		cta: string;
		photoAlt: string;
	};
	hero: {
		eyebrow: string;
		viewProjects: string;
		contact: string;
	};
	marquee: {
		srOnly: string;
		items: readonly string[];
	};
	servicesSection: {
		eyebrow: string;
		headingMuted: string;
		headingAccent: string;
		headingLead: string;
		intro: string;
		projectTypesAria: string;
		explore: string;
		scrollHint: string;
		processEyebrow: string;
		processHeading: string;
		processHeadingMuted: string;
		stepsAria: string;
		useCases: readonly UseCaseCopy[];
		steps: readonly StepCopy[];
	};
	portfolioSection: {
		eyebrow: string;
		heading: string;
		headingMuted: string;
		countLabel: string;
		intro: string;
		listAria: string;
		projects: Record<string, PortfolioCopy>;
	};
	contact: {
		eyebrow: string;
		heading: string;
		headingAccent: string;
		intro: string;
		whatsapp: string;
		email: string;
		faqHeading: string;
		faqHeadingAccent: string;
		openChat: string;
		whatsappPrefill: string;
	};
	footer: {
		tagline: string;
		navAria: string;
		backToTop: string;
		emailLabel: string;
		linkedinLabel: string;
	};
	seo: {
		ogImageAlt: string;
		llmsTitle: string;
		llmsFullTitle: string;
	};
	llms: {
		officialSite: string;
		language: string;
		location: string;
		aiSummary: string;
		services: string;
		faqs: string;
		capabilities: string;
		capabilityItems: readonly string[];
		stack: string;
		projects: string;
		contact: string;
		formLink: string;
		keywords: string;
		usefulLinks: string;
		shortSummary: string;
		extendedVersion: string;
		sitemap: string;
		urlLabel: string;
		tagsLabel: string;
	};
};
