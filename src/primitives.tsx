import { useId, type ReactNode } from 'react';
import { clamp, counter, progress, stagger, type Easing } from './timing';

export function CountUp({ frame, start = 0, end = 45, to, from = 0, decimals = 0, prefix = '', suffix = '', x = 0, y = 0, fill = 'currentColor', fontSize = 48 }: { frame: number; start?: number; end?: number; to: number; from?: number; decimals?: number; prefix?: string; suffix?: string; x?: number; y?: number; fill?: string; fontSize?: number }) {
 decimals = Math.trunc(clamp(decimals, 0, 6));
 return <text x={x} y={y} fill={fill} fontSize={fontSize}>{prefix}{counter(frame, start, end, to, from, decimals).toFixed(decimals)}{suffix}</text>;
}
export function Wipe({ frame, start = 0, end = 30, x = 0, y = 0, width, height, direction = 'left-to-right', easing, children }: { frame: number; start?: number; end?: number; x?: number; y?: number; width: number; height: number; direction?: 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top'; easing?: Easing; children: ReactNode }) {
 const id = `wipe-${useId().replace(/:/g, '')}`;
 const p = progress(frame, start, end, easing), horizontal = direction === 'left-to-right' || direction === 'right-to-left';
 return <g><defs><clipPath id={id}><rect x={x + (direction === 'right-to-left' ? width * (1 - p) : 0)} y={y + (direction === 'bottom-to-top' ? height * (1 - p) : 0)} width={horizontal ? width * p : width} height={horizontal ? height : height * p}/></clipPath></defs><g clipPath={`url(#${id})`}>{children}</g></g>;
}
export type BarItem = { label: string; height: number; color?: string; icon?: ReactNode };
export function StaggeredBars({ frame, items, start = 0, duration = 24, delay = 3, x = 0, baseline = 400, barWidth = 90, gap = 12, color = '#008A68', textColor = 'currentColor', highlight = -1, highlightColor = '#EF704C' }: { frame: number; items: BarItem[]; start?: number; duration?: number; delay?: number; x?: number; baseline?: number; barWidth?: number; gap?: number; color?: string; textColor?: string; highlight?: number; highlightColor?: string }) {
 return <g>{items.map((item, i) => { const p = stagger(frame, i, start, duration, delay), bx = x + i * (barWidth + gap), h = Math.max(0, item.height) * p; return <g key={`${item.label}-${i}`}><rect x={bx} y={baseline - h} width={barWidth} height={h} fill={i === highlight ? highlightColor : item.color || color}/><g opacity={p} transform={`translate(${bx + barWidth / 2} ${baseline - h - 40})`}>{item.icon}</g><text x={bx + barWidth / 2} y={baseline + 28} textAnchor="middle" fontSize="14" fill={textColor}>{item.label}</text></g>; })}</g>;
}
export function Spotlight({ frame, start = 0, end = 20, x, y, width, height, color = '#EF704C', children }: { frame: number; start?: number; end?: number; x: number; y: number; width: number; height: number; color?: string; children?: ReactNode }) {
 const p = progress(frame, start, end); return <g opacity={p}><rect x={x} y={y} width={width} height={height} fill="none" stroke={color} strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p}/><path d={`M${x + width / 2} ${y - 48}v28m-12-12l12 12 12-12`} fill="none" stroke={color} strokeWidth="3"/>{children}</g>;
}
