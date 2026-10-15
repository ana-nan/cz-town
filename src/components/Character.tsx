import { asset, type Outfit, type Point } from '../data/town';

type Props = { name: string; outfit: Outfit; position: Point; height?: number; player?: boolean; walking?: boolean; left?: boolean; bubble?: string; gesture?: 'idle' | 'wave' | 'celebrate' | 'look'; onClick?: () => void };
export function Character({ name, outfit, position, height = 118, player, walking, left, bubble, gesture = 'idle', onClick }: Props) {
  return <button type="button" className={`character ${player ? 'is-player' : ''} ${walking ? 'is-walking' : ''} gesture-${gesture}`} style={{ left: position.x, top: position.y, width: height * .77, height, zIndex: Math.round(position.y) }} onClick={event => { event.stopPropagation(); onClick?.(); }} aria-label={player ? '我的小龙' : `和${name}打招呼`}>
    {player && <span className="player-ring" />}
    <span className="character-shadow" />
    <span className="character-direction" style={{ transform: left ? 'scaleX(-1)' : undefined }}><img className="character-art" src={asset(`characters/${outfit}.png`)} alt="" draggable={false} /></span>
    <span className="character-name">{player && <i />} {name}</span>
    {bubble && <span className="speech-bubble">{bubble}</span>}
  </button>;
}
