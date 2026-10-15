import { useEffect, useState } from 'react';
import type { Post } from '../data/town';

const key = 'chuangzhi-read-messages-v1';
const fingerprint = (post: Post) => `${post.title}|${post.body}|${post.comments.length}`;
function loadRead(): Record<string, string> {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? '{}');
    if (value && typeof value === 'object' && !Array.isArray(value)) return Object.fromEntries(Object.entries(value).filter(([, v]) => typeof v === 'string')) as Record<string, string>;
  } catch { /* Keep a session-only record when browser storage is unavailable. */ }
  return {};
}
export function useUnread(posts: Post[]) {
  const [read, setRead] = useState(loadRead);
  const unread = posts.filter(post => read[post.id] !== fingerprint(post));
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(read)); } catch { /* Session only. */ } }, [read]);
  const markRead = (items: Post[]) => setRead(current => ({ ...current, ...Object.fromEntries(items.map(post => [post.id, fingerprint(post)])) }));
  return { unread, markRead };
}
