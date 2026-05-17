/**
 * Scroll suave con duración y easing controlados — más rápido y fluido que
 * `scroll-behavior: smooth` nativo (especialmente en mobile y Safari).
 */
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const coarse = window.matchMedia("(pointer: coarse)");

let activeFrame: number | null = null;
let activeCleanup: (() => void) | null = null;

/** Misma curva que --ease-out-expo en global.css */
function easeOutExpo(t: number): number {
	return t >= 1 ? 1 : 1 - 2 ** (-10 * t);
}

function getDuration(distance: number): number {
	const abs = Math.abs(distance);
	const perPx = coarse.matches ? 0.26 : 0.3;
	const min = coarse.matches ? 300 : 340;
	const max = coarse.matches ? 580 : 680;
	return Math.min(max, Math.max(min, abs * perPx));
}

function notifyScrollEnd(): void {
	window.dispatchEvent(new Event("scrollend"));
}

export function cancelSmoothScroll(): void {
	if (activeFrame !== null) {
		cancelAnimationFrame(activeFrame);
		activeFrame = null;
	}
	activeCleanup?.();
	activeCleanup = null;
}

export function smoothScrollTo(targetY: number): void {
	const startY = window.scrollY;
	const distance = targetY - startY;
	if (Math.abs(distance) < 2) return;

	if (reduced.matches) {
		window.scrollTo(0, targetY);
		return;
	}

	cancelSmoothScroll();

	const duration = getDuration(distance);
	const start = performance.now();
	const passive = { passive: true } as const;

	const onUserScroll = (): void => cancelSmoothScroll();

	const cleanup = (): void => {
		window.removeEventListener("wheel", onUserScroll, passive);
		window.removeEventListener("touchstart", onUserScroll, passive);
		window.removeEventListener("keydown", onUserScroll);
		activeCleanup = null;
	};

	activeCleanup = cleanup;
	window.addEventListener("wheel", onUserScroll, passive);
	window.addEventListener("touchstart", onUserScroll, passive);
	window.addEventListener("keydown", onUserScroll);

	const tick = (now: number): void => {
		const t = Math.min(1, (now - start) / duration);
		window.scrollTo(0, startY + distance * easeOutExpo(t));

		if (t < 1) {
			activeFrame = requestAnimationFrame(tick);
		} else {
			activeFrame = null;
			cleanup();
			notifyScrollEnd();
		}
	};

	activeFrame = requestAnimationFrame(tick);
}

export function smoothScrollToElement(
	el: Element,
	opts: { block?: "start" | "center" } = {},
): void {
	const block = opts.block ?? "start";
	const rect = el.getBoundingClientRect();
	const style = window.getComputedStyle(el);
	const marginTop = Number.parseFloat(style.scrollMarginTop) || 0;
	const marginBottom = Number.parseFloat(style.scrollMarginBottom) || 0;

	let targetY: number;
	if (block === "center") {
		targetY =
			window.scrollY +
			rect.top +
			rect.height / 2 -
			window.innerHeight / 2 +
			(marginTop - marginBottom) / 2;
	} else {
		targetY = window.scrollY + rect.top - marginTop;
	}

	smoothScrollTo(Math.max(0, targetY));
}

function initAnchors(): void {
	document.addEventListener("click", (e) => {
		const anchor = (e.target as Element).closest?.('a[href^="#"]');
		if (!(anchor instanceof HTMLAnchorElement)) return;

		const hash = anchor.getAttribute("href");
		if (!hash || hash === "#") return;

		const id = decodeURIComponent(hash.slice(1));
		const target = document.getElementById(id);
		if (!target) return;

		e.preventDefault();
		smoothScrollToElement(target);
		history.pushState(null, "", hash);

		const drawer = anchor.closest("details.nav-drawer");
		if (drawer instanceof HTMLDetailsElement) drawer.open = false;
	});
}

function init(): void {
	initAnchors();
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
	init();
}
