import type { ServiceSlug } from "../../data/services";

export type ServicePageContent = {
	title: string;
	description: string;
	h1: string;
	h1Accent: string;
	intro: string;
	benefitsTitle: string;
	benefits: readonly string[];
	includesTitle: string;
	includes: readonly string[];
	cta: string;
	whatsappPrefill: string;
	backHome: string;
};

export type ServicePagesCopy = Record<ServiceSlug, ServicePageContent>;

export const servicePagesEs: ServicePagesCopy = {
	"landing-page-conversion": {
		title: "Landing page de conversión en Lima | AE Webdes",
		description:
			"Landing pages orientadas a conversión: mensaje claro, CTA visible y formulario sin fricción. Diseño y desarrollo en Lima y remoto LATAM.",
		h1: "Landing page",
		h1Accent: "de conversión",
		intro:
			"Páginas enfocadas en un solo objetivo: convertir visitas en contactos, registros o ventas. Ideales para campañas, lanzamientos y validación de producto.",
		benefitsTitle: "Qué resuelve",
		benefits: [
			"Mensaje directo sin distracciones",
			"CTA visible desde el primer scroll",
			"Carga rápida y SEO técnico incluido",
			"Diseño mobile-first listo para anuncios",
		],
		includesTitle: "Qué incluye",
		includes: [
			"Brief, wireframe y diseño UI",
			"Desarrollo con Astro o WordPress",
			"Integración WhatsApp, formulario o CRM",
			"Publicación y ajustes post-lanzamiento",
		],
		cta: "Quiero una landing",
		whatsappPrefill: "Hola, me interesa una landing page de conversión con AE Webdes.",
		backHome: "Volver al inicio",
	},
	"diseno-web-lima": {
		title: "Diseño web corporativo en Lima | AE Webdes",
		description:
			"Webs corporativas profesionales en Lima: servicios, equipo, confianza y contacto directo. WordPress, Astro o React a medida.",
		h1: "Diseño web",
		h1Accent: "corporativo en Lima",
		intro:
			"Presencia digital sólida para empresas que necesitan explicar qué hacen, generar confianza y facilitar el contacto con clientes y partners.",
		benefitsTitle: "Qué resuelve",
		benefits: [
			"Imagen profesional alineada a tu marca",
			"Estructura clara de servicios y propuesta de valor",
			"Contacto directo (WhatsApp, correo, mapa)",
			"Base preparada para crecer en contenido y SEO",
		],
		includesTitle: "Qué incluye",
		includes: [
			"Arquitectura de información y diseño UI/UX",
			"Desarrollo responsive y accesible",
			"SEO técnico y metadatos por página",
			"Capacitación básica para actualizar contenido",
		],
		cta: "Quiero mi web corporativa",
		whatsappPrefill: "Hola, me interesa una web corporativa con AE Webdes.",
		backHome: "Volver al inicio",
	},
	"tienda-online-wordpress": {
		title: "Tienda online WordPress en Perú | AE Webdes",
		description:
			"E-commerce con WordPress: catálogo, WhatsApp o pagos, panel editable. Tiendas online para negocios en Lima y LATAM.",
		h1: "Tienda online",
		h1Accent: "con WordPress",
		intro:
			"Catálogo claro, checkout o WhatsApp con un clic, y un panel que puedes gestionar sin depender de un desarrollador para cada cambio.",
		benefitsTitle: "Qué resuelve",
		benefits: [
			"Vender o recibir pedidos en línea",
			"Catálogo organizado por categorías",
			"Integración WhatsApp para consultas rápidas",
			"Panel WordPress para stock y precios",
		],
		includesTitle: "Qué incluye",
		includes: [
			"Diseño de tienda acorde a tu marca",
			"Configuración WooCommerce o catálogo a medida",
			"Optimización móvil y rendimiento",
			"Guía de uso del panel administrativo",
		],
		cta: "Quiero mi tienda online",
		whatsappPrefill: "Hola, me interesa una tienda online WordPress con AE Webdes.",
		backHome: "Volver al inicio",
	},
	"producto-digital": {
		title: "Producto digital a medida | React y Astro — AE Webdes",
		description:
			"Cotizadores, dashboards y flujos B2B con React o Astro. Productos digitales a medida para equipos en Perú y LATAM.",
		h1: "Producto digital",
		h1Accent: "a medida",
		intro:
			"Herramientas web que van más allá de un sitio informativo: cotizadores, paneles, flujos de venta B2B y productos internos.",
		benefitsTitle: "Qué resuelve",
		benefits: [
			"Automatizar cotizaciones o procesos manuales",
			"Interfaces claras para equipos comerciales",
			"Integraciones con APIs, hojas de cálculo o CRM",
			"Escalabilidad con stack moderno (React, Astro)",
		],
		includesTitle: "Qué incluye",
		includes: [
			"Definición de flujo y arquitectura",
			"UI/UX y desarrollo frontend + lógica",
			"Pruebas, despliegue y documentación",
			"Soporte post-lanzamiento acordado",
		],
		cta: "Quiero un producto digital",
		whatsappPrefill: "Hola, me interesa un producto digital a medida con AE Webdes.",
		backHome: "Volver al inicio",
	},
};
