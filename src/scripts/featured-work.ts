/**
 * Tilt 3D y parallax interno en tarjetas de proyectos destacados.
 */
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

function initFeaturedTilt(): void {
	if (reduced.matches) return;

	const cards = document.querySelectorAll<HTMLElement>("[data-featured-tilt]");
	if (!cards.length) return;

	for (const card of cards) {
		const media = card.querySelector<HTMLElement>(".featured-work__media");
		const img = card.querySelector<HTMLElement>(".featured-work__img");
		if (!media) continue;

		let raf = 0;
		let targetX = 0;
		let targetY = 0;
		let currentX = 0;
		let currentY = 0;

		const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

		const tick = (): void => {
			currentX = lerp(currentX, targetX, 0.12);
			currentY = lerp(currentY, targetY, 0.12);

			const rotateX = currentY * -7;
			const rotateY = currentX * 7;
			media.style.setProperty("--tilt-x", `${rotateX}deg`);
			media.style.setProperty("--tilt-y", `${rotateY}deg`);

			if (img && !img.classList.contains("portfolio-preview-pan")) {
				img.style.setProperty("--img-shift-x", `${currentX * 10}px`);
				img.style.setProperty("--img-shift-y", `${currentY * 8}px`);
			}

			if (
				Math.abs(currentX - targetX) > 0.001 ||
				Math.abs(currentY - targetY) > 0.001 ||
				targetX !== 0 ||
				targetY !== 0
			) {
				raf = requestAnimationFrame(tick);
			} else {
				raf = 0;
			}
		};

		const schedule = (): void => {
			if (!raf) raf = requestAnimationFrame(tick);
		};

		card.addEventListener("pointerenter", () => {
			card.classList.add("is-tilting");
		});

		card.addEventListener("pointermove", (e) => {
			const rect = card.getBoundingClientRect();
			targetX = (e.clientX - rect.left) / rect.width - 0.5;
			targetY = (e.clientY - rect.top) / rect.height - 0.5;
			schedule();
		});

		const reset = (): void => {
			card.classList.remove("is-tilting");
			targetX = 0;
			targetY = 0;
			schedule();
		};

		card.addEventListener("pointerleave", reset);
		card.addEventListener("blur", reset, true);
	}
}

function init(): void {
	initFeaturedTilt();
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
	init();
}

reduced.addEventListener("change", () => {
	if (reduced.matches) {
		for (const media of document.querySelectorAll<HTMLElement>(".featured-work__media")) {
			media.style.removeProperty("--tilt-x");
			media.style.removeProperty("--tilt-y");
		}
		for (const img of document.querySelectorAll<HTMLElement>(".featured-work__img")) {
			img.style.removeProperty("--img-shift-x");
			img.style.removeProperty("--img-shift-y");
		}
	}
});
