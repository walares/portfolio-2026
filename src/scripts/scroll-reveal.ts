/**
 * Marca bloques al entrar en el viewport; respeta prefers-reduced-motion.
 */
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

function revealAll(): void {
	for (const el of document.querySelectorAll<HTMLElement>(
		"[data-reveal], .reveal, .reveal-stagger, .reveal-lines",
	)) {
		el.classList.add("is-inview");
	}
}

function init(): void {
	if (reduced.matches) {
		revealAll();
		return;
	}

	// Hero visible al cargar
	for (const el of document.querySelectorAll<HTMLElement>(".reveal-lines")) {
		const rect = el.getBoundingClientRect();
		if (rect.top < window.innerHeight * 0.92) el.classList.add("is-inview");
	}

	const selectors = "[data-reveal], .reveal, .reveal-stagger, .reveal-lines";
	const nodes = document.querySelectorAll<HTMLElement>(selectors);
	if (!nodes.length) return;

	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				const target = entry.target as HTMLElement;
				target.classList.add("is-inview");
				io.unobserve(target);
			}
		},
		{
			root: null,
			rootMargin: "0px 0px -6% 0px",
			threshold: [0, 0.06, 0.12],
		},
	);

	for (const el of nodes) io.observe(el);
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
	init();
}

reduced.addEventListener("change", () => {
	if (reduced.matches) revealAll();
});
