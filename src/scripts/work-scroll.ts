/**
 * Catálogo #work: scroll pinneado, apertura de “puerta” y proyectos en secuencia.
 * Inspirado en wodniack.dev/work — sin dependencias externas.
 */
import { smoothScrollTo, smoothScrollToElement } from "./smooth-scroll";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

const DOOR_START = 0.06;
const DOOR_END = 0.32;
const PROJECTS_START = 0.28;
const PROJECTS_END = 0.98;

function clamp(n: number, min = 0, max = 1): number {
	return Math.min(max, Math.max(min, n));
}

function easeOutCubic(t: number): number {
	return 1 - (1 - t) ** 3;
}

function getActiveIndex(raw: number, count: number): number {
	const span = PROJECTS_END - PROJECTS_START;
	const slice = span / count;
	return Math.min(count - 1, Math.max(0, Math.floor((raw - PROJECTS_START) / slice)));
}

/** Fracción del tramo de cada proyecto reservada a entrada / salida (resto = nítido). */
const ITEM_FADE_IN = 0.14;
const ITEM_FADE_OUT_START = 0.78;
const ITEM_FADE_OUT_END = 0.95;

/** Progreso de scroll donde el proyecto queda en su punto más visible. */
function getProjectTargetProgress(index: number, count: number): number {
	const span = PROJECTS_END - PROJECTS_START;
	const slice = span / count;
	const start = PROJECTS_START + slice * index;
	return start + slice * (ITEM_FADE_IN + (ITEM_FADE_OUT_START - ITEM_FADE_IN) * 0.5);
}

function initWorkScroll(): void {
	const root = document.querySelector<HTMLElement>("[data-work-scroll]");
	if (!root) return;

	const stage = root.querySelector<HTMLElement>("[data-work-stage]");
	const door = root.querySelector<HTMLElement>("[data-work-door]");
	const items = root.querySelectorAll<HTMLElement>("[data-work-item]");
	const counter = root.querySelector<HTMLElement>("[data-work-counter]");
	const navButtons = root.querySelectorAll<HTMLButtonElement>("[data-work-jump]");

	if (!stage) return;

	let jumpTargetIndex: number | null = null;
	let jumpEndTimer: ReturnType<typeof setTimeout> | undefined;

	const setNavActive = (index: number): void => {
		navButtons.forEach((btn, i) => {
			const active = i === index;
			btn.classList.toggle("is-active", active);
			btn.setAttribute("aria-current", active ? "true" : "false");
		});
	};

	const snapProjectVisuals = (index: number): void => {
		items.forEach((item, i) => {
			const progress = i === index ? 1 : 0;
			item.style.setProperty("--item-progress", String(progress));
			item.classList.toggle("is-active", i === index);
		});
		setNavActive(index);
		if (counter) {
			counter.textContent = String(index + 1).padStart(2, "0");
		}
	};

	const endNavJump = (): void => {
		if (jumpTargetIndex === null) return;
		jumpTargetIndex = null;
		root.classList.remove("is-nav-jumping");
		update();
	};

	const scheduleJumpEndCheck = (targetIndex: number, startedAt = performance.now()): void => {
		clearTimeout(jumpEndTimer);
		jumpEndTimer = setTimeout(() => {
			const scrollable = root.offsetHeight - window.innerHeight;
			if (scrollable <= 0) {
				endNavJump();
				return;
			}
			const raw = clamp(-root.getBoundingClientRect().top / scrollable);
			const n = items.length || 1;
			const targetRaw = getProjectTargetProgress(targetIndex, n);
			const timedOut = performance.now() - startedAt > 1200;
			if (Math.abs(raw - targetRaw) < 0.02 || timedOut) {
				endNavJump();
			} else {
				scheduleJumpEndCheck(targetIndex, startedAt);
			}
		}, 80);
	};

	const scrollToProject = (index: number): void => {
		const n = items.length || 1;
		const safeIndex = clamp(index, 0, n - 1);

		if (reduced.matches) {
			const item = items[safeIndex];
			if (item) smoothScrollToElement(item, { block: "center" });
			else window.scrollTo(0, 0);
			snapProjectVisuals(safeIndex);
			return;
		}

		const scrollable = root.offsetHeight - window.innerHeight;
		if (scrollable <= 0) return;

		const targetRaw = getProjectTargetProgress(safeIndex, n);
		const rootTop = root.getBoundingClientRect().top + window.scrollY;
		const targetY = rootTop + targetRaw * scrollable;

		clearTimeout(jumpEndTimer);
		jumpTargetIndex = safeIndex;
		root.classList.add("is-nav-jumping");
		snapProjectVisuals(safeIndex);

		smoothScrollTo(targetY);
		scheduleJumpEndCheck(safeIndex);
	};

	navButtons.forEach((btn) => {
		btn.addEventListener("click", () => {
			const index = Number(btn.dataset.workJump);
			if (Number.isFinite(index)) scrollToProject(index);
		});
	});

	if (reduced.matches) {
		root.classList.add("is-complete");
		root.style.setProperty("--work-progress", "1");
		root.style.setProperty("--door-progress", "1");
		for (const item of items) item.style.setProperty("--item-progress", "1");
		setNavActive(0);
		return;
	}

	let ticking = false;

	const update = (): void => {
		ticking = false;
		const rect = root.getBoundingClientRect();
		const scrollable = root.offsetHeight - window.innerHeight;
		if (scrollable <= 0) return;

		const raw = clamp(-rect.top / scrollable);
		root.style.setProperty("--work-progress", String(raw));

		const doorRaw = clamp((raw - DOOR_START) / (DOOR_END - DOOR_START));
		const doorProgress = easeOutCubic(doorRaw);
		root.style.setProperty("--door-progress", String(doorProgress));

		if (door) {
			door.setAttribute("aria-hidden", doorProgress > 0.92 ? "true" : "false");
		}

		const n = items.length || 1;

		if (jumpTargetIndex !== null) {
			snapProjectVisuals(jumpTargetIndex);
			root.classList.toggle("is-door-open", doorProgress > 0.42);
			root.classList.toggle("is-complete", raw > 0.96);
			return;
		}

		const span = PROJECTS_END - PROJECTS_START;
		const slice = span / n;

		items.forEach((item, i) => {
			const start = PROJECTS_START + slice * i;
			const enterEnd = start + slice * ITEM_FADE_IN;
			const exitStart = start + slice * ITEM_FADE_OUT_START;
			const exitEnd = start + slice * ITEM_FADE_OUT_END;
			const isLast = i === n - 1;

			let local = 0;
			if (raw < start) {
				local = 0;
			} else if (raw < enterEnd) {
				local = easeOutCubic((raw - start) / (enterEnd - start));
			} else if (isLast || raw < exitStart) {
				local = 1;
			} else if (raw < exitEnd) {
				local = 1 - easeOutCubic((raw - exitStart) / (exitEnd - exitStart));
			} else {
				local = 0;
			}

			item.style.setProperty("--item-progress", String(clamp(local)));
			item.classList.toggle("is-active", local > 0.5);
		});

		const activeIndex = getActiveIndex(raw, n);
		if (counter) {
			counter.textContent = String(activeIndex + 1).padStart(2, "0");
		}
		setNavActive(activeIndex);

		root.classList.toggle("is-door-open", doorProgress > 0.42);
		root.classList.toggle("is-complete", raw > 0.96);
	};

	const onScroll = (): void => {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(update);
	};

	const onScrollEnd = (): void => {
		if (jumpTargetIndex !== null) endNavJump();
	};

	update();
	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", onScroll, { passive: true });
	window.addEventListener("scrollend", onScrollEnd, { passive: true });

	reduced.addEventListener("change", () => {
		if (reduced.matches) initWorkScroll();
	});
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initWorkScroll, { once: true });
} else {
	initWorkScroll();
}
