/**
 * Malla del hero: cuadrícula deformada por el cursor (pozo gravitatorio).
 */
const GRID_STEP = 64;
const LINE_COLOR = "255, 255, 255";
const LINE_ALPHA = 0.09;
const WELL_RADIUS_RATIO = 0.38;
const MAX_PULL = 56;
const MOUSE_LERP = 0.1;
const RELEASE_LERP = 0.06;

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

type Point = { x: number; y: number };

function warpPoint(px: number, py: number, mx: number, my: number, radius: number): Point {
	const dx = mx - px;
	const dy = my - py;
	const distSq = dx * dx + dy * dy;
	const r2 = radius * radius;
	if (distSq < 1) return { x: px, y: py };

	const t = Math.exp(-distSq / (r2 * 0.55));
	const pull = MAX_PULL * t;
	const dist = Math.sqrt(distSq);
	return {
		x: px + (dx / dist) * pull,
		y: py + (dy / dist) * pull,
	};
}

function applyRadialFade(ctx: CanvasRenderingContext2D, w: number, h: number): void {
	const cx = w * 0.5;
	const cy = h * 0.4;
	const radius = Math.hypot(w * 0.4, h * 0.35);
	ctx.save();
	ctx.globalCompositeOperation = "destination-in";
	const g = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
	g.addColorStop(0, "rgba(0,0,0,1)");
	g.addColorStop(0.55, "rgba(0,0,0,0.88)");
	g.addColorStop(1, "rgba(0,0,0,0)");
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, w, h);
	ctx.restore();
}

function initHeroSpacetimeGrid(): void {
	const section = document.querySelector<HTMLElement>("#inicio");
	const container = section?.querySelector<HTMLElement>("[data-hero-bg]");
	const canvas = section?.querySelector<HTMLCanvasElement>("[data-hero-spacetime-grid]");
	const fallback = section?.querySelector<HTMLElement>("[data-hero-grid-fallback]");
	if (!section || !container || !canvas) return;

	const ctx = canvas.getContext("2d", { alpha: true });
	if (!ctx) return;

	let width = 0;
	let height = 0;
	let cols = 0;
	let rows = 0;
	let base: Point[][] = [];
	let smoothX = 0;
	let smoothY = 0;
	let targetX = 0;
	let targetY = 0;
	let hasPointer = false;
	let activePull = 0;
	let rafId = 0;
	let dpr = 1;
	let ready = false;

	const buildMesh = (): void => {
		cols = Math.ceil(width / GRID_STEP) + 1;
		rows = Math.ceil(height / GRID_STEP) + 1;
		base = [];
		for (let row = 0; row < rows; row++) {
			const line: Point[] = [];
			for (let col = 0; col < cols; col++) {
				line.push({ x: col * GRID_STEP, y: row * GRID_STEP });
			}
			base.push(line);
		}
	};

	const draw = (mx: number, my: number, pullStrength: number): void => {
		if (width < 2 || height < 2 || !base.length) return;

		const radius = Math.min(width, height) * WELL_RADIUS_RATIO;
		const warped: Point[][] = base.map((row) =>
			row.map((p) => {
				if (pullStrength <= 0.001) return p;
				const w = warpPoint(p.x, p.y, mx, my, radius);
				return {
					x: p.x + (w.x - p.x) * pullStrength,
					y: p.y + (w.y - p.y) * pullStrength,
				};
			}),
		);

		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, width, height);
		ctx.strokeStyle = `rgba(${LINE_COLOR}, ${LINE_ALPHA})`;
		ctx.lineWidth = 1;
		ctx.lineCap = "square";

		const strokeLines = (alongRows: boolean): void => {
			if (alongRows) {
				for (let r = 0; r < rows; r++) {
					ctx.beginPath();
					for (let c = 0; c < cols; c++) {
						const { x, y } = warped[r][c];
						if (c === 0) ctx.moveTo(x + 0.5, y + 0.5);
						else ctx.lineTo(x + 0.5, y + 0.5);
					}
					ctx.stroke();
				}
			} else {
				for (let c = 0; c < cols; c++) {
					ctx.beginPath();
					for (let r = 0; r < rows; r++) {
						const { x, y } = warped[r][c];
						if (r === 0) ctx.moveTo(x + 0.5, y + 0.5);
						else ctx.lineTo(x + 0.5, y + 0.5);
					}
					ctx.stroke();
				}
			}
		};

		strokeLines(true);
		strokeLines(false);
		applyRadialFade(ctx, width, height);
	};

	const resize = (): void => {
		const rect = container.getBoundingClientRect();
		width = Math.max(1, Math.floor(rect.width));
		height = Math.max(1, Math.floor(rect.height));
		dpr = Math.min(window.devicePixelRatio || 1, 2);

		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;
		canvas.width = width * dpr;
		canvas.height = height * dpr;

		buildMesh();
		if (!hasPointer) {
			smoothX = width * 0.5;
			smoothY = height * 0.38;
			targetX = smoothX;
			targetY = smoothY;
		}

		draw(smoothX, smoothY, activePull);

		if (!ready && width > 100 && height > 100) {
			ready = true;
			fallback?.classList.add("is-hidden");
			canvas.classList.add("is-ready");
		}
	};

	const setPointerFromEvent = (clientX: number, clientY: number): void => {
		const rect = container.getBoundingClientRect();
		targetX = clientX - rect.left;
		targetY = clientY - rect.top;
		hasPointer = true;
	};

	const onPointerMove = (e: PointerEvent): void => {
		setPointerFromEvent(e.clientX, e.clientY);
	};

	const onPointerLeave = (): void => {
		hasPointer = false;
		targetX = width * 0.5;
		targetY = height * 0.38;
	};

	const tick = (): void => {
		const lerp = hasPointer ? MOUSE_LERP : RELEASE_LERP;
		smoothX += (targetX - smoothX) * lerp;
		smoothY += (targetY - smoothY) * lerp;
		activePull += ((hasPointer ? 1 : 0) - activePull) * (hasPointer ? 0.14 : 0.07);
		draw(smoothX, smoothY, activePull);
		rafId = requestAnimationFrame(tick);
	};

	const ro = new ResizeObserver(() => resize());
	ro.observe(container);

	section.addEventListener("pointermove", onPointerMove, { passive: true });
	section.addEventListener("pointerleave", onPointerLeave, { passive: true });

	requestAnimationFrame(() => {
		requestAnimationFrame(resize);
	});

	if (reduced.matches) return;

	rafId = requestAnimationFrame(tick);
}

function boot(): void {
	initHeroSpacetimeGrid();
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
	boot();
}
