import { useCallback, useEffect, useRef, useState } from 'react';
import type { Point } from '../data/town';

// The paved plaza is convex: a straight path between any two valid points stays on it.
export function constrainToPlaza(point: Point): Point {
  const dx = (point.x - 800) / 420;
  const dy = (point.y - 707) / 133;
  const length = Math.hypot(dx, dy);
  return length <= 1 ? point : { x: 800 + dx / length * 420, y: 707 + dy / length * 133 };
}

export function usePlayerMovement(disabled: boolean, interact: () => void, wave: () => void) {
  const [motion, setMotion] = useState({ position: { x: 800, y: 716 }, moving: false, left: false });
  const [target, setTarget] = useState<Point | null>(null);
  const current = useRef(motion.position);
  const destination = useRef<Point | null>(null);
  const keys = useRef(new Set<string>());
  const callbacks = useRef({ disabled, interact, wave });
  callbacks.current = { disabled, interact, wave };

  const walkTo = useCallback((point: Point) => {
    destination.current = constrainToPlaza(point);
    setTarget(destination.current);
  }, []);

  useEffect(() => {
    const directions: Record<string, Point> = {
      w: { x: 0, y: -1 }, arrowup: { x: 0, y: -1 }, s: { x: 0, y: 1 }, arrowdown: { x: 0, y: 1 },
      a: { x: -1, y: 0 }, arrowleft: { x: -1, y: 0 }, d: { x: 1, y: 0 }, arrowright: { x: 1, y: 0 },
    };
    const down = (event: KeyboardEvent) => {
      if (callbacks.current.disabled || (event.target as HTMLElement).closest('input, textarea, select, [contenteditable="true"]')) return;
      const key = event.key.toLowerCase();
      if (directions[key]) { event.preventDefault(); keys.current.add(key); destination.current = null; setTarget(null); }
      if (key === 'e' && !event.repeat) callbacks.current.interact();
      if (key === ' ' && !event.repeat && (event.target as HTMLElement).tagName !== 'BUTTON') { event.preventDefault(); callbacks.current.wave(); }
    };
    const up = (event: KeyboardEvent) => keys.current.delete(event.key.toLowerCase());
    const reset = () => keys.current.clear();
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', reset);
    let frame = 0;
    let previous = 0;
    let wasMoving = false;
    let facingLeft = false;
    const tick = (now: number) => {
      const elapsed = Math.min((now - previous) / 1000 || 0, .035);
      previous = now;
      let dx = 0; let dy = 0;
      if (!callbacks.current.disabled) {
        keys.current.forEach(key => { dx += directions[key]?.x ?? 0; dy += directions[key]?.y ?? 0; });
        if (!dx && !dy && destination.current) {
          dx = destination.current.x - current.current.x;
          dy = destination.current.y - current.current.y;
          if (Math.hypot(dx, dy) < 5) { dx = 0; dy = 0; destination.current = null; setTarget(null); }
        }
      } else keys.current.clear();
      const distance = Math.hypot(dx, dy);
      let moving = false;
      if (distance) {
        const amount = Math.min(195 * elapsed, destination.current ? distance : Infinity);
        const next = constrainToPlaza({ x: current.current.x + dx / distance * amount, y: current.current.y + dy / distance * amount });
        moving = Math.hypot(next.x - current.current.x, next.y - current.current.y) > .03;
        if (Math.abs(dx) > .05) facingLeft = dx < 0;
        current.current = next;
      }
      if (moving || wasMoving !== moving) setMotion({ position: { ...current.current }, moving, left: facingLeft });
      wasMoving = moving;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', reset);
    };
  }, []);

  return { ...motion, target, walkTo };
}
