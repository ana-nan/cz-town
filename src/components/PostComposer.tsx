import { useState } from 'react';
import { places, getPlace, type PlaceId, type NoticeType } from '../data/town';
import { Icon } from './Icon';

export function PostComposer({ initialCategory = 'bottle', onSubmit }: { initialCategory?: PlaceId; onSubmit: (title: string, body: string, category: PlaceId, noticeType?: NoticeType) => void }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [noticeType, setNoticeType] = useState<NoticeType>('poster');
  return <form className="post-composer" onSubmit={event => { event.preventDefault(); if (title.trim() && body.trim()) onSubmit(title.trim(), body.trim(), category, noticeType); }}>
    <label>分享到哪里<select value={category} onChange={event => setCategory(event.target.value as PlaceId)}>{places.map(place => <option key={place.id} value={place.id}>{place.name}</option>)}</select></label>
    {category === 'voice' && <p className="anonymous-note"><Icon name="chat" size={20}/>本条发言和回复显示匿名身份，不展示你的昵称与装扮。</p>}
    {category === 'notice' && <label>公告类型<select value={noticeType} onChange={event => setNoticeType(event.target.value as NoticeType)}><option value="poster">活动海报 / 招募</option><option value="signal">前沿信号 / 资讯</option></select></label>}
    <label>想分享什么？<input value={title} onChange={event => setTitle(event.target.value)} maxLength={60} placeholder="给这个小故事起个标题" required autoFocus/></label>
    <label>展开说说<textarea value={body} onChange={event => setBody(event.target.value)} maxLength={1500} rows={5} placeholder="一个发现、一份邀请，或者今天的好心情…" required/></label>
    <button className="primary-button" disabled={!title.trim() || !body.trim()}><Icon name="plus" size={18}/>{getPlace(category).action}</button>
  </form>;
}
