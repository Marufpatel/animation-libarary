export const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
export const linear = (t: number) => clamp(t);
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const smoothstep = (t: number) => { const v = clamp(t); return v * v * (3 - 2 * v); };
export type Easing = (t: number) => number;
export function progress(frame: number, start: number, end: number, easing: Easing = easeOutCubic) {
 return easing(end <= start ? (frame >= start ? 1 : 0) : clamp((frame - start) / (end - start)));
}
export const lerp = (from: number, to: number, t: number) => from + (to - from) * clamp(t);
export function counter(frame: number, start: number, end: number, to: number, from = 0, decimals = 0) {
 const places = Math.pow(10, Math.trunc(clamp(decimals, 0, 6)));
 return Math.round(lerp(from, to, progress(frame, start, end)) * places) / places;
}
export function stagger(frame: number, index: number, start = 0, duration = 24, delay = 3) {
 return progress(frame, start + index * delay, start + index * delay + duration);
}
