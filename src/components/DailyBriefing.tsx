import { places, type Post } from '../data/town';
import { Icon } from './Icon';

export function DailyBriefing({ posts, unread, onPost, onDismiss, onMarkAll }: { posts: Post[]; unread: Post[]; onPost: (post: Post) => void; onDismiss: () => void; onMarkAll: () => void }) {
  const date = new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long', timeZone: 'Asia/Shanghai' }).format(new Date());
  const unreadIds = new Set(unread.map(post => post.id));
  return <div className="daily-briefing">
    <div className="daily-masthead"><span>THE LITTLE TOWN POST</span><span>{date}</span></div>
    <div className="daily-intro"><div><span className="daily-edition">来自创智龙广场的问候</span><h3>小镇有新鲜事，<br/>也有人在等你。</h3><p>{unread.length ? <>你有 <strong>{unread.length}</strong> 条未读动态，先看看今天的消息吧。</> : '未读消息都看完啦。再看看各个角落最近发生的事。'}</p></div><div className="daily-seal"><Icon name="sun" size={35}/><span>小镇日报</span><small>GOOD TO SEE YOU</small></div></div>
    <div className="daily-sections">{places.map(place => {
      const updates = posts.filter(post => post.category === place.id);
      const fresh = updates.filter(post => unreadIds.has(post.id));
      const visible = fresh.length ? fresh : updates.slice(0, 1);
      return <section className="daily-section" key={place.id}><header><span className="daily-section-number" style={{ color: place.color }}>{place.number}</span><h4>{place.name}<small>{place.subtitle}</small></h4><span className={`daily-unread ${fresh.length ? 'has-news' : ''}`}>{fresh.length ? `${fresh.length} 条未读` : '已读'}</span></header><div className="daily-stories">{visible.map(post => <button key={post.id} onClick={() => onPost(post)}><span className="daily-story-title">{unreadIds.has(post.id) && <i/>}{post.title}</span><small>{post.body}</small><span className="daily-story-meta">{post.category === 'voice' ? '匿名小龙' : post.author} · {post.time}<Icon name="arrow" size={14}/></span></button>)}</div></section>;
    })}</div>
    <footer className="daily-footer"><button className="daily-mark-read" onClick={onMarkAll} disabled={!unread.length}>{unread.length ? '全部标为已读' : '✓ 已读完全部动态'}</button><button className="primary-button" onClick={onDismiss}>去广场逛逛<Icon name="arrow" size={17}/></button></footer>
  </div>;
}
