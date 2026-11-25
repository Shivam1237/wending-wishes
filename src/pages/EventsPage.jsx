import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ChevronLeft, ChevronRight, Download, ExternalLink, MessageCircle, Pencil, Plus, Search, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { api, qrUrl } from '../lib/api.js';
import { Button, EmptyState, Loading, Notice, PageHeading, StatusBadge } from '../components/UI.jsx';

const dateFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [workingId, setWorkingId] = useState('');

  const refresh = useCallback(async (query = search, targetPage = page) => {
    setLoading(true); setError('');
    try {
      const result = await api(`/admin/events?search=${encodeURIComponent(query)}&page=${targetPage}`);
      setEvents(result.events); setTotal(result.total); setPages(result.pages);
      return result;
    } catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }, [search, page]);
  useEffect(() => { const timer = setTimeout(() => refresh(search, page), 250); return () => clearTimeout(timer); }, [refresh, search, page]);

  async function toggle(eventItem) {
    setWorkingId(eventItem.id); setError('');
    try {
      await api(`/admin/events/${eventItem.id}/status`, { method: 'PATCH', body: JSON.stringify({ isActive: !eventItem.isActive }) });
      await refresh(search, page);
    } catch (requestError) { setError(requestError.message); }
    finally { setWorkingId(''); }
  }

  async function remove(eventItem) {
    if (!window.confirm(`Delete "${eventItem.coupleNames}"? This permanently deletes all of its guest wishes.`)) return;
    setWorkingId(eventItem.id); setError('');
    try {
      await api(`/admin/events/${eventItem.id}`, { method: 'DELETE' });
      const result = await refresh(search, page);
      if (result?.events.length === 0 && page > 1) setPage((current) => current - 1);
    } catch (requestError) { setError(requestError.message); }
    finally { setWorkingId(''); }
  }

  return <>
    <PageHeading eyebrow="Your celebrations" title="All events" description={`${total} ${total === 1 ? 'guestbook' : 'guestbooks'} in your studio.`} action={<Link to="/admin/events/new"><Button><Plus size={16} />Create event</Button></Link>} />
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><label className="relative block w-full max-w-sm"><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" /><input className="field pl-10" type="search" aria-label="Search events" placeholder="Search by names or title..." value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} /></label><p className="text-xs text-muted">Keep every celebration in one place.</p></div>
    {error && <div className="mb-4"><Notice>{error}</Notice></div>}
    {loading ? <Loading label="Finding your events..." /> : events.length === 0 ? <EmptyState title={search ? 'No events found' : 'Your first guestbook is waiting'}>{search ? 'Try another name or event title.' : 'Create a guestbook for a celebration and share its QR code with guests.'}<div className="mt-5"><Link to="/admin/events/new"><Button><Plus size={16} />Create event</Button></Link></div></EmptyState> : <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="hidden grid-cols-[minmax(220px,1.6fr)_minmax(130px,.8fr)_100px_100px_minmax(225px,1fr)] gap-4 border-b border-line bg-cream/55 px-5 py-3 text-[10px] font-bold uppercase tracking-[.15em] text-muted lg:grid"><span>Celebration</span><span>Event date</span><span>Status</span><span>Wishes</span><span className="text-right">Actions</span></div>
      <div className="divide-y divide-line/70">{events.map((item) => <article key={item.id} className="grid gap-4 px-4 py-5 sm:px-5 lg:grid-cols-[minmax(220px,1.6fr)_minmax(130px,.8fr)_100px_100px_minmax(225px,1fr)] lg:items-center">
        <div className="min-w-0"><div className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blush/45 text-cocoa"><CalendarDays size={18} /></span><div className="min-w-0"><p className="truncate font-display text-lg text-ink">{item.coupleNames}</p><p className="truncate text-xs text-muted">{item.title}</p></div></div></div>
        <div className="text-xs text-muted"><span className="block font-semibold text-ink">{item.eventDate ? dateFormat.format(new Date(item.eventDate)) : 'Date not set'}</span><span className="mt-1 block text-[10px]">Created {dateFormat.format(new Date(item.createdAt))}</span></div>
        <div><StatusBadge active={item.isActive} /></div>
        <div className="flex items-center gap-2 text-sm font-semibold text-cocoa"><MessageCircle size={15} className="text-clay" />{item.messageCount}</div>
        <div className="flex flex-wrap items-center gap-1.5 lg:justify-end">
          <Link title="View guestbook messages" to={`/admin/events/${item.id}`} className="icon-action"><ExternalLink size={16} /><span className="lg:hidden">View</span></Link>
          <Link title="Edit event" to={`/admin/events/${item.id}/edit`} className="icon-action"><Pencil size={16} /><span className="lg:hidden">Edit</span></Link>
          <a title="Download QR code" href={qrUrl(item.id, 'png', true)} className="icon-action"><Download size={16} /><span className="lg:hidden">QR</span></a>
          <button title={item.isActive ? 'Close guestbook' : 'Activate guestbook'} disabled={workingId === item.id} onClick={() => toggle(item)} className="icon-action">{item.isActive ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}<span className="lg:hidden">{item.isActive ? 'Close' : 'Open'}</span></button>
          <button title="Delete event and messages" disabled={workingId === item.id} onClick={() => remove(item)} className="icon-action text-red-600 hover:bg-red-50"><Trash2 size={16} /><span className="lg:hidden">Delete</span></button>
        </div>
      </article>)}</div>
    </div>}
    {!loading && pages > 1 && <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3"><p className="text-xs text-muted">Page {page} of {pages} <span className="hidden sm:inline">· {total} events</span></p><div className="flex gap-2"><Button variant="secondary" className="px-3 py-2" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}><ChevronLeft size={16} />Previous</Button><Button variant="secondary" className="px-3 py-2" disabled={page >= pages} onClick={() => setPage((current) => current + 1)}>Next<ChevronRight size={16} /></Button></div></div>}
  </>;
}
