import { useState } from 'react';
import { asset, type Place, type Post, type NoticeType } from '../data/town';
import { PostCard } from './PostCard';
import { Icon } from './Icon';

function readChoices(): { joined: string[]; mood: string } {
  try {
    const data = JSON.parse(localStorage.getItem('chuangzhi-activities') ?? '{}');
    return { joined: Array.isArray(data.joined) ? data.joined.filter((id: unknown) => typeof id === 'string') : [], mood: typeof data.mood === 'string' ? data.mood : '' };
  } catch { return { joined: [], mood: '' }; }
}

export function PlaceExperience({ place, posts, onPost, onCompose }: { place: Place; posts: Post[]; onPost: (post: Post) => void; onCompose: () => void }) {
  const [choices, setChoices] = useState(readChoices);
  const [noticeFilter, setNoticeFilter] = useState<NoticeType | 'all'>('all');
  const [caughtId, setCaughtId] = useState<string | null>(null);
  const [drawnIds, setDrawnIds] = useState<string[]>([]);
  const entries = posts.filter(post => post.category === place.id);
  const caught = entries.find(post => post.id === caughtId);
  const saveChoices = (next: typeof choices) => {
    setChoices(next);
    try { localStorage.setItem('chuangzhi-activities', JSON.stringify(next)); } catch { /* Session interactions remain available. */ }
  };
  const drawBottle = () => {
    // Show each bottle once per round; avoid returning the same one immediately.
    const available = entries.filter(post => !drawnIds.includes(post.id));
    const pool = available.length ? available : entries.filter(post => post.id !== caughtId);
    const candidates = pool.length ? pool : entries;
    if (!candidates.length) return;
    const next = candidates[Math.floor(Math.random() * candidates.length)];
    setCaughtId(next.id);
    setDrawnIds(previous => available.length ? [...previous, next.id] : [next.id]);
  };

  if (place.id === 'bottle') return <div className="place-experience bottle-experience">
    <div className="bottle-hero"><span className="bottle-orbit"/><img src={asset('landmarks/bottle-station.png')} alt="装着小故事的蓝色漂流瓶"/><span className="bottle-sparkle">✦</span></div>
    <h3>{caught ? '这一只，刚好漂向你' : '今天，会捞到谁的故事？'}</h3>
    <p className="dialog-intro">一件小事、一个发现，或一句想送给陌生人的话。</p>
    {caught && <div className="caught-bottle" aria-live="polite"><span className="small-eyebrow">一份偶然遇见的分享</span><h4>{caught.title}</h4><p>{caught.body}</p><button className="text-link" onClick={() => onPost(caught)}>给这只瓶子一个回应<Icon name="arrow" size={16}/></button></div>}
    {!entries.length && <p className="quiet-text">这里还没有瓶子，来留下第一份分享吧。</p>}
    <div className="experience-actions"><button className="primary-button" disabled={!entries.length} onClick={drawBottle}><Icon name="sparkle" size={18}/>{caught ? '再捞一只' : '捞一只漂流瓶'}</button><button className="secondary-button" onClick={onCompose}><Icon name="plus" size={18}/>投一只漂流瓶</button></div>
  </div>;

  return <div className={`place-experience experience-${place.id}`}>
    <p className="dialog-intro">{place.description}</p>
    {place.id === 'heart' && <div className="mood-checkin"><span className="small-eyebrow">给今天的自己留个位置</span><h3>此刻，你的心情是什么颜色？</h3><div className="mood-options">{[{ label: '晴朗', color: '#f4ce77' }, { label: '平静', color: '#91d0be' }, { label: '有点累', color: '#a3b9df' }, { label: '想抱抱', color: '#e5a7bc' }].map(mood => <button key={mood.label} aria-pressed={choices.mood === mood.label} onClick={() => saveChoices({ ...choices, mood: mood.label })}><i style={{ background: mood.color }}/>{mood.label}</button>)}</div><p role="status">{choices.mood ? `已经记下「${choices.mood}」。每一种感受，都可以在这里停一会儿。` : '选一个颜色，完成今天的心情打卡。'}</p></div>}
    {place.id === 'voice' && <div className="anonymous-note"><Icon name="chat" size={25}/><span><strong>这里，只听见你的声音</strong><small>发言和回复使用统一匿名身份。请温柔回应每一份表达。</small></span></div>}
    {place.id === 'notice' && <div className="notice-tabs">{[{ id: 'all', label: '全部消息' }, { id: 'signal', label: '前沿信号' }, { id: 'poster', label: '活动海报' }].map(item => <button key={item.id} aria-pressed={noticeFilter === item.id} onClick={() => setNoticeFilter(item.id as typeof noticeFilter)}>{item.label}</button>)}</div>}
    <div className="place-posts">{entries.filter(post => place.id !== 'notice' || noticeFilter === 'all' || (post.noticeType ?? 'poster') === noticeFilter).map(post => <div className="experience-post" key={post.id}><PostCard post={post} expanded onClick={() => onPost(post)}/>{place.id === 'heart' && <button className="join-activity" aria-pressed={choices.joined.includes(post.id)} onClick={() => saveChoices({ ...choices, joined: choices.joined.includes(post.id) ? choices.joined.filter(id => id !== post.id) : [...choices.joined, post.id] })}>{choices.joined.includes(post.id) ? '✓ 已加入 · 点击取消' : '我也参加'}<Icon name="arrow" size={14}/></button>}</div>)}</div>
    <button className="primary-button" onClick={onCompose}><Icon name="plus" size={17}/>{place.action}</button>
  </div>;
}
