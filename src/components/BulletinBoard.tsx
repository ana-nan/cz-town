import { useState } from 'react';
import { places, type PlaceId, type Post } from '../data/town';
import { PostCard } from './PostCard';
import { Icon } from './Icon';

export function BulletinBoard({ posts, onPost, onCompose }: { posts: Post[]; onPost: (post: Post) => void; onCompose: () => void }) {
  const [category, setCategory] = useState<PlaceId | 'all'>('all');
  const [query, setQuery] = useState('');
  const visible = posts.filter(post => (category === 'all' || post.category === category) && `${post.title} ${post.body}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="bulletin-board">
    <div className="board-heading"><div><span className="small-eyebrow">LITTLE NOTES, BIG CONNECTIONS</span><h1>今天，小镇有什么新鲜事？</h1><p>读读大家的日常，也留下你的故事。</p></div><button className="primary-button" onClick={onCompose}><Icon name="plus" size={18}/>贴一张新帖</button></div>
    <div className="board-tools"><div className="category-tabs"><button aria-pressed={category === 'all'} onClick={() => setCategory('all')}>全部</button>{places.map(place => <button key={place.id} aria-pressed={category === place.id} onClick={() => setCategory(place.id)}>{place.name}</button>)}</div><label className="search-field"><Icon name="search" size={17}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="找一点感兴趣的…" aria-label="搜索帖子"/></label></div>
    <div className="board-grid">{visible.map(post => <PostCard key={post.id} expanded post={post} onClick={() => onPost(post)}/>)}</div>
    {!visible.length && <div className="empty-state"><Icon name="search" size={30}/><h3>暂时还没有找到</h3><p>换个关键词，或者贴上第一张新帖。</p></div>}
  </section>;
}
