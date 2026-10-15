import { useCallback, useEffect, useRef, useState } from 'react';
import { neighbors, type Point } from '../data/town';
import { constrainToPlaza } from './usePlayerMovement';

type Gesture = 'idle' | 'wave' | 'celebrate' | 'look';
type Walker = typeof neighbors[number] & { walking: boolean; left: boolean; bubble?: string; gesture: Gesture };
type Agent = { person: Walker; route: Point[]; nextMove: number; speed: number; bubbleUntil: number; arrivalLine?: string; arrivalGesture?: Gesture; linger: number };
type EventKind = 'chat' | 'birthday' | 'butterfly' | 'cat' | 'wave';
const points: Point[] = [
  { x: 530, y: 708 }, { x: 578, y: 635 }, { x: 800, y: 584 }, { x: 1025, y: 638 },
  { x: 1110, y: 707 }, { x: 1025, y: 772 }, { x: 800, y: 808 }, { x: 610, y: 774 },
  { x: 640, y: 734 }, { x: 960, y: 734 }, { x: 800, y: 780 },
];
const links = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[0,8],[8,7],[8,10],[10,9],[9,4],[9,5],[10,6]];
const distance = (a: Point, b: Point) => Math.hypot(a.x-b.x, a.y-b.y);
const random = (min: number, max: number) => min + Math.random() * (max-min);

// Routes follow a small promenade network around the party footprint.
function routeTo(position: Point, goal: number): Point[] {
  const start = points.reduce((best, point, index) => distance(point, position) < distance(points[best], position) ? index : best, 0);
  const costs = points.map(() => Infinity); const previous = points.map(() => -1); const visited = new Set<number>();
  costs[start] = 0;
  while (visited.size < points.length) {
    let current = -1;
    costs.forEach((cost, index) => { if (!visited.has(index) && (current < 0 || cost < costs[current])) current = index; });
    if (current < 0 || !Number.isFinite(costs[current]) || current === goal) break;
    visited.add(current);
    links.forEach(([a,b]) => {
      const next = a === current ? b : b === current ? a : -1;
      if (next < 0) return;
      const cost = costs[current] + distance(points[current], points[next]);
      if (cost < costs[next]) { costs[next] = cost; previous[next] = current; }
    });
  }
  const path: number[] = [goal];
  while (path[0] !== start && previous[path[0]] >= 0) path.unshift(previous[path[0]]);
  return path.map(index => ({ ...points[index] }));
}
function avoidParty(point: Point, active: boolean): Point {
  const next = constrainToPlaza(point);
  if (!active) return next;
  const dx = (next.x - 800) / 212; const dy = (next.y - 651) / 57; const radius = Math.hypot(dx,dy);
  if (radius >= 1) return next;
  return constrainToPlaza({ x: 800 + (radius ? dx/radius : 0)*212, y: 651 + (radius ? dy/radius : 1)*57 });
}
const makeAgents = (): Agent[] => neighbors.map((person,index) => ({ person: { ...person, position: { ...person.position }, walking: false, left: false, gesture: 'idle' }, route: [], nextMove: .4 + index*1.1, speed: 45 + index*7, bubbleUntil: 0, linger: 3 }));

export function useNpcLife(paused: boolean, birthdayVisible: boolean, player: Point) {
  const agents = useRef<Agent[]>(makeAgents());
  const simulation = useRef(0);
  const options = useRef({ paused, birthdayVisible, player });
  options.current = { paused, birthdayVisible, player };
  const [characters, setCharacters] = useState<Walker[]>(() => agents.current.map(agent => ({ ...agent.person })));
  const [celebrating, setCelebrating] = useState(false);

  const greet = useCallback((name: string) => {
    const agent = agents.current.find(item => item.person.name === name);
    if (!agent) return;
    agent.route = []; agent.nextMove = simulation.current + 5; agent.bubbleUntil = simulation.current + 4.5;
    agent.arrivalLine = undefined; agent.person.bubble = agent.person.greeting; agent.person.gesture = 'wave'; agent.person.walking = false;
    setCharacters(agents.current.map(item => ({ ...item.person, position: { ...item.person.position } })));
  }, []);

  useEffect(() => {
    let frame = 0; let previous = 0; let published = 0; let nextEvent = 7; let eventUntil = 0; let partyAt = Infinity; let lastEvent: EventKind | null = null;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const send = (agent: Agent, goal: number, line: string, gesture: Gesture = 'look') => {
      agent.route = reduced.matches ? [] : routeTo(agent.person.position, goal);
      agent.arrivalLine = line; agent.arrivalGesture = gesture; agent.linger = random(5,8);
      agent.nextMove = simulation.current + 18;
    };
    const startEvent = () => {
      const types: EventKind[] = ['chat','butterfly','cat','wave', ...(options.current.birthdayVisible ? ['birthday' as const] : [])];
      const choices = types.filter(type => type !== lastEvent);
      const type = simulation.current < 12 && options.current.birthdayVisible ? 'birthday' : choices[Math.floor(Math.random()*choices.length)];
      lastEvent = type;
      const [a,b,c] = agents.current;
      if (type === 'birthday') {
        send(a,8,'等一下，我站这边！','celebrate'); send(b,10,'三、二、一，生日快乐！','celebrate'); send(c,9,'祝小镇每天都有好消息。','celebrate');
        partyAt = simulation.current + 8;
      } else if (type === 'chat') {
        send(a,8,'你带旧书来了吗？','wave'); send(b,7,'带了两本，等会儿给你看看。','wave');
      } else if (type === 'cat') {
        send(c,3,'嘘，它又睡着了。');
      } else if (type === 'butterfly') {
        send(a,0,'看，是刚才那只小蝴蝶！');
      } else {
        const nearest = [0,4,6,8,9,10].reduce((best,index) => distance(points[index],options.current.player) < distance(points[best],options.current.player) ? index : best,8);
        send(b,nearest,'嗨，要不要一起逛逛？','wave');
      }
      eventUntil = simulation.current + 15; nextEvent = eventUntil + random(9,16);
    };
    const tick = (timestamp: number) => {
      const dt = Math.min((timestamp-previous)/1000 || 0,.06); previous = timestamp;
      if (!options.current.paused && !document.hidden) {
        simulation.current += dt;
        const now = simulation.current;
        if (now >= nextEvent) startEvent();
        if (now >= partyAt) { if (options.current.birthdayVisible) setCelebrating(true); partyAt = Infinity; }
        if (eventUntil && now > eventUntil) { setCelebrating(false); eventUntil = 0; }
        if (!options.current.birthdayVisible) { setCelebrating(false); partyAt = Infinity; }
        agents.current.forEach((agent,index) => {
          if (agent.person.bubble && now > agent.bubbleUntil) { agent.person.bubble = undefined; agent.person.gesture = 'idle'; }
          if (!agent.route.length && agent.arrivalLine) {
            agent.person.bubble = agent.arrivalLine; agent.person.gesture = agent.arrivalGesture ?? 'look'; agent.bubbleUntil = now + 4.5 + index*.5;
            agent.arrivalLine = undefined; agent.nextMove = now + agent.linger;
          }
          if (!agent.route.length && now >= agent.nextMove && !reduced.matches) {
            const candidates = [0,1,3,4,5,6,7,8,9,10].filter(point => distance(agent.person.position,points[point]) > 100);
            agent.route = routeTo(agent.person.position,candidates[Math.floor(Math.random()*candidates.length)]);
            agent.linger = random(2.5,6); agent.speed = random(42,66); agent.person.gesture = 'idle';
          }
          let moving = false;
          const goal = agent.route[0];
          if (goal && !reduced.matches) {
            const d = distance(agent.person.position,goal);
            if (d < 5) { agent.route.shift(); if (!agent.route.length) agent.nextMove = now + agent.linger; }
            else {
              const amount = Math.min(d,agent.speed*dt); const dx = (goal.x-agent.person.position.x)/d; const dy = (goal.y-agent.person.position.y)/d;
              let next = { x: agent.person.position.x+dx*amount, y: agent.person.position.y+dy*amount };
              const others = [...agents.current.filter(other => other !== agent).map(other => other.person.position),options.current.player];
              others.forEach(other => { const gap = distance(next,other); if (gap > 0 && gap < 42) { const push = (42-gap)*dt*2; next = { x: next.x+(next.x-other.x)/gap*push, y: next.y+(next.y-other.y)/gap*push }; } });
              next = avoidParty(next,options.current.birthdayVisible);
              moving = distance(next,agent.person.position) > .02;
              if (Math.abs(dx) > .1) agent.person.left = dx < 0;
              agent.person.position = next;
            }
          }
          agent.person.walking = moving;
        });
        if (timestamp-published > 50) { setCharacters(agents.current.map(agent => ({ ...agent.person, position: { ...agent.person.position } }))); published = timestamp; }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
  return { characters, celebrating, greet };
}
