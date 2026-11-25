import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Heart, MessageCircleHeart, Plus, TrendingUp } from 'lucide-react';
import { api } from '../lib/api.js';
import { Button, EmptyState, Loading, Notice, PageHeading } from '../components/UI.jsx';

const numberFormat = new Intl.NumberFormat();
const dateFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api('/admin/dashboard').then(setData).catch((requestError) => setError(requestError.message)); }, []);
  if (error) return <Notice>{error}</Notice>;
  if (!data) return <Loading label="Gathering your guestbook notes…" />;

  const stats = [
    { label: 'Total events', value: data.totalEvents, icon: CalendarDays, detail: 'Across your celebrations' },
    { label: 'Active guestbooks', value: data.activeEvents, icon: TrendingUp, detail: 'Ready to receive wishes' },
    { label: 'Guest wishes', value: data.totalMessages, icon: MessageCircleHeart, detail: 'Little notes to keep' },
  ];

  return <>
    <PageHeading eyebrow="Your studio" title="A lovely overview" description="Here’s what’s happening across your celebrations." action={<Link to="/admin/events/new"><Button><Plus size={16} />Create an event</Button></Link>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{stats.map(({ label, value, icon: Icon, detail }) => <div key={label} className="rounded-2xl border border-line bg-white p-5 shadow-[0_4px_20px_-16px_rgba(52,42,33,.25)] sm:p-6"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-muted">{label}</p><p className="mt-3 font-display text-4xl text-ink">{numberFormat.format(value)}</p></div><span className="grid size-11 place-items-center rounded-2xl bg-cream text-clay"><Icon size={20} /></span></div><p className="mt-5 text-xs text-muted">{detail}</p></div>)}</div>
    <div className="mt-9 grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between"><div><h2 className="font-display text-2xl text-ink">Recent wishes</h2><p className="mt-1 text-xs text-muted">The newest notes from your guests</p></div><span className="grid size-10 place-items-center rounded-xl bg-cream text-clay"><Heart size={18} /></span></div>
        {data.recentMessages.length ? <div className="divide-y divide-line/70">{data.recentMessages.map((item) => <div key={item.id} className="flex gap-3 py-4 first:pt-0 last:pb-0"><span className="mt-1 grid size-9 shrink-0 place-items-center rounded-full bg-blush/50 text-xs font-bold text-cocoa">{item.name.slice(0, 1).toUpperCase()}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-semibold text-ink">{item.name}<span className="ml-2 text-xs font-normal text-muted">{item.event?.title || 'Event removed'}</span></p><time className="text-[11px] text-muted">{dateFormat.format(new Date(item.createdAt))}</time></div><p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">{item.message}</p>{item.event && <Link className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-clay hover:text-cocoa" to={`/admin/events/${item.event.id}`}>View guestbook <ArrowRight size={13} /></Link>}</div></div>)}</div> : <EmptyState title="Your first wish is on its way">Once a guest signs your book, their note will appear here.</EmptyState>}
      </section>
      <aside className="relative overflow-hidden rounded-2xl bg-[#6e4e39] p-6 text-white sm:p-7"><div className="absolute -right-10 -top-10 size-40 rounded-full border border-white/10" /><div className="absolute -right-2 -top-2 size-24 rounded-full border border-white/10" /><div className="relative"><span className="grid size-11 place-items-center rounded-2xl bg-white/10"><CalendarDays size={20} /></span><p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-[#e5c7aa]">Make a new memory</p><h2 className="mt-3 font-display text-3xl leading-tight">A new celebration starts here.</h2><p className="mt-3 text-sm leading-6 text-white/70">Create an event page and let the wishes find their way to you.</p><Link to="/admin/events/new" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-cocoa transition hover:bg-[#f7eee5]">Create event <ArrowRight size={16} /></Link></div></aside>
    </div>
  </>;
}
