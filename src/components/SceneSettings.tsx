import { Icon } from './Icon';
type Props = { night: boolean; onNight: (value: boolean) => void; birthday: boolean; onBirthday: () => void; music: boolean; onMusic: () => void; zoom: number; onZoom: (value: number) => void };
export function SceneSettings({ night, onNight, birthday, onBirthday, music, onMusic, zoom, onZoom }: Props) {
  return <div className="scene-preferences">
    <p className="settings-intro">给今天的小镇，选一个喜欢的氛围。</p>
    <div className="lighting-options" aria-label="选择昼夜"><button className={!night ? 'chosen' : ''} aria-pressed={!night} onClick={() => onNight(false)}><span>☀</span><strong>晴日漫游</strong><small>阳光、微风与湖面</small></button><button className={night ? 'chosen' : ''} aria-pressed={night} onClick={() => onNight(true)}><span>☾</span><strong>星夜小聚</strong><small>星光、暖灯与萤火</small></button></div>
    <div className="preference-row"><div><strong>节日布置</strong><small>9·12 生日横幅与蛋糕</small></div><button className="preference-switch" role="switch" aria-label="节日布置" aria-checked={birthday} onClick={onBirthday}><i/></button></div>
    <div className="preference-row"><div><strong>小镇音乐</strong><small>散步时的轻柔背景音乐</small></div><button className="preference-switch" role="switch" aria-label="小镇音乐" aria-checked={music} onClick={onMusic}><i/></button></div>
    <div className="preference-row"><div><strong>地图视角</strong><small>拉近一点，看看身边的小事</small></div><div className="settings-zoom"><button disabled={zoom <= 1} aria-label="拉远视角" onClick={() => onZoom(Math.max(1, +(zoom-.15).toFixed(2)))}>−</button><button onClick={() => onZoom(1)} aria-label="恢复默认视角">{zoom.toFixed(1)}×</button><button disabled={zoom >= 1.6} aria-label="拉近视角" onClick={() => onZoom(Math.min(1.6, +(zoom+.15).toFixed(2)))}>+</button></div></div>
    <div className="classic-mode-note"><Icon name="book" size={17}/><span>经典 BBS 模式</span><small>待开放</small></div>
  </div>;
}
