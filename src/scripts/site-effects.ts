/**
 * Efectos globales estilo Pomelo: navbar al scroll, marquesinas, scroll horizontal.
 */
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

function initNavbar(): void {
	const header = document.querySelector<HTMLElement>("[data-site-header]");
	if (!header) return;

	const onScroll = (): void => {
		header.classList.toggle("is-scrolled", window.scrollY > 24);
	};
	onScroll();
	window.addEventListener("scroll", onScroll, { passive: true });
}

function initMarquees(): void {
	if (reduced.matches) return;

	for (const track of document.querySelectorAll<HTMLElement>("[data-marquee]")) {
		const inner = track.querySelector<HTMLElement>(".marquee__inner");
		if (!inner || inner.dataset.cloned === "true") continue;
		inner.dataset.cloned = "true";
		inner.append(...Array.from(inner.children).map((n) => n.cloneNode(true)));
	}
}

function initHorizontalScroll(): void {
	for (const el of document.querySelectorAll<HTMLElement>("[data-hscroll]")) {
		let isDown = false;
		let startX = 0;
		let scrollLeft = 0;

		el.addEventListener("pointerdown", (e) => {
			isDown = true;
			el.classList.add("is-dragging");
			startX = e.clientX;
			scrollLeft = el.scrollLeft;
		});

		const end = (): void => {
			isDown = false;
			el.classList.remove("is-dragging");
		};

		el.addEventListener("pointerleave", end);
		el.addEventListener("pointerup", end);

		el.addEventListener("pointermove", (e) => {
			if (!isDown) return;
			e.preventDefault();
			const walk = (e.clientX - startX) * 1.15;
			el.scrollLeft = scrollLeft - walk;
		});

		el.addEventListener(
			"wheel",
			(e) => {
				if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
				if (!el.matches(":hover")) return;
				e.preventDefault();
				el.scrollLeft += e.deltaY * 0.85;
			},
			{ passive: false },
		);
	}
}

function initParallax(): void {
	if (reduced.matches) return;

	const nodes = document.querySelectorAll<HTMLElement>("[data-parallax]");
	if (!nodes.length) return;

	const onScroll = (): void => {
		const vh = window.innerHeight;
		for (const el of nodes) {
			const speed = Number(el.dataset.parallax) || 0.12;
			const rect = el.getBoundingClientRect();
			const center = rect.top + rect.height * 0.5 - vh * 0.5;
			const offset = center * speed;
			el.style.setProperty("--parallax-y", `${offset}px`);
		}
	};

	onScroll();
	window.addEventListener("scroll", onScroll, { passive: true });
}

function init(): void {
	initNavbar();
	initMarquees();
	initHorizontalScroll();
	initParallax();
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
	init();
}
