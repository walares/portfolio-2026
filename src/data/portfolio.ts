export type PortfolioProject = {
	id: string;
	title: string;
	year: string;
	url: string;
	description: string;
	tags: string[];
	scrollGif?: string;
	previewLocal?: string;
	accent: {
		glow: string;
		pill: string;
		line: string;
	};
};

export const portfolioProjects: PortfolioProject[] = [
	{
		id: "aa01",
		title: "Altiplano Headhunters",
		year: "2022",
		url: "https://altiplanoheadhunters.com/",
		description:
			"Consultora de headhunting en minería: web corporativa con ofertas de empleo, servicios claros y contacto directo.",
		tags: ["Corporativo", "Minería"],
		accent: {
			glow: "from-emerald-500/20 via-transparent to-transparent",
			pill: "bg-emerald-500/15 text-emerald-300",
			line: "bg-emerald-400",
		},
	},
	{
		id: "aa02",
		title: "Matifruti",
		year: "2026",
		url: "https://matifruti.com/",
		description: "Tienda WordPress: catálogo claro y WhatsApp con un clic.",
		tags: ["WordPress", "E-commerce"],
		accent: {
			glow: "from-amber-500/22 via-transparent to-transparent",
			pill: "bg-amber-500/15 text-amber-200",
			line: "bg-amber-400",
		},
	},
	{
		id: "aa03",
		title: "Gifford Languages",
		year: "2022",
		url: "https://giffordlanguages.com/index-es.html",
		description: "Academia online: metodología clara y reserva sencilla.",
		tags: ["Multilingüe", "Marca"],
		accent: {
			glow: "from-sky-500/18 via-transparent to-transparent",
			pill: "bg-sky-500/15 text-sky-200",
			line: "bg-sky-400",
		},
	},
	{
		id: "aa04",
		title: "Cotizador LAE Educación",
		year: "2025",
		url: "https://english-quotes.vercel.app/",
		description: "B2B: cotizador con precios en pantalla y flujo rápido para ventas.",
		tags: ["React", "Producto"],
		accent: {
			glow: "from-brand-green/24 via-transparent to-brand-gold/8",
			pill: "bg-brand-green/15 text-brand-green",
			line: "bg-brand-green",
		},
	},
	{
		id: "aa05",
		title: "Sellex Auto",
		year: "2026",
		url: "https://sellexauto.com/",
		description:
			"Importadora de autos premium en Perú: catálogo en línea, pedidos por importación y acompañamiento de cotización a entrega.",
		tags: ["Automotriz", "Catálogo"],
		accent: {
			glow: "from-rose-500/20 via-transparent to-transparent",
			pill: "bg-rose-500/15 text-rose-200",
			line: "bg-rose-400",
		},
	},
];
