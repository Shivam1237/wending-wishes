import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Download, ExternalLink, Heart, Pencil, QrCode, Search, Trash2 } from 'lucide-react';
import { api, qrUrl } from '../lib/api.js';
import { Button, EmptyState, Loading, Notice, PageHeading, StatusBadge } from '../components/UI.jsx';

const dateFormat = new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
const timeFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 0, total: 0 });
  const [search, setSearch] = useState('');
  const [relationship, setRelationship] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const load = useCallback(async (nextPage = page, searchText = search, relation = relationship) => {
    setLoading(true); setError('');
    const query = new URLSearchParams({ page: String(nextPage), search: searchText, relationship: relation });
    try {
      const result = await api(`/admin/events/${id}?${query}`);
      setEvent(result.event); setMessages(result.messages); setPagination({ page: result.page, pages: result.pages, total: result.total });
    } catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }, [id, page, search, relationship]);

  useEffect(() => { const timer = setTimeout(() => load(page, search, relationship), 220); return () => clearTimeout(timer); }, [page, search, relationship, load]);

  async function remove(message) {
    if (!window.confirm(`Delete ${message.name}'s wish? This cannot be undone.`)) return;
    try { await api(`/admin/events/${id}/messages/${message.id}`, { method: 'DELETE' }); await load(page, search, relationship); }
    catch (requestError) { setError(requestError.message); }
  }

  async function copyLink() {
    try { await navigator.clipboard.writeText(event.publicUrl); setCopied(true); setTimeout(() => setCopied(false), 1600); }
    catch { setError('The public link could not be copied.'); }
  }

  if (loading && !event) return <Loading label="Opening your guestbook…" />;
  if (error && !event) return <Notice>{error}</Notice>;
  if (!event) return null;

  const exportQuery = new URLSearchParams();
  if (search) exportQuery.set('search', search);
  if (relationship) exportQuery.set('relationship', relationship);

  return <>
    <Link to="/admin/events" className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-cocoa"><ArrowLeft size={15} />All events</Link>
    <PageHeading eyebrow={event.title} title={event.coupleNames} description={event.eventDate ? dateFormat.format(new Date(event.eventDate)) : 'A celebration of love and good company.'} action={<div className="flex flex-wrap gap-2"><Link to={`/admin/events/${id}/edit`}><Button variant="secondary"><Pencil size={15} />Edit</Button></Link><a href={qrUrl(id, 'png', true)}><Button variant="secondary"><Download size={15} />QR code</Button></a><a href={`/api/admin/events/${id}/export.csv?${exportQuery}`}><Button><Download size={15} />Export CSV</Button></a></div>} />
    {error && <div className="mb-4"><Notice>{error}</Notice></div>}
    <section className="mb-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_300px]">
      <div className="flex flex-col justify-between gap-5 rounded-2xl border border-line bg-white p-5 sm:flex-row sm:items-center sm:p-6"><div><div className="flex items-center gap-2"><StatusBadge active={event.isActive} /><span className="text-xs text-muted">{event.messageCount} {event.messageCount === 1 ? 'wish' : 'wishes'}</span></div><p className="mt-4 max-w-2xl font-display text-xl leading-relaxed text-ink">“{event.description}”</p><div className="mt-4 flex flex-wrap items-center gap-2 text-xs"><a href={event.publicUrl} target="_blank" rel="noreferrer" className="max-w-full truncate rounded-lg border border-line bg-cream/40 px-3 py-2 text-cocoa"><ExternalLink size={13} className="mr-1.5 inline" />{event.publicUrl}</a><Button variant="ghost" className="px-2 py-2" onClick={copyLink}>{copied ? 'Copied' : 'Copy link'}</Button></div></div><span className="hidden size-12 shrink-0 place-items-center rounded-2xl bg-cream text-clay sm:grid"><Heart size={21} /></span></div>
      <div className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4"><img src={qrUrl(id)} alt={`QR code for ${event.coupleNames}`} className="size-24 rounded-lg border border-line" /><div><p className="text-sm font-semibold text-ink">Share this guestbook</p><p className="mt-1 text-xs leading-5 text-muted">Guests can scan this code to leave a wish.</p><a href={qrUrl(id, 'png', true)} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-clay hover:text-cocoa"><QrCode size={14} />Download QR</a></div></div>
    </section>

    <section className="rounded-2xl border border-line bg-white">
      <div className="flex flex-col gap-4 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div><h2 className="font-display text-2xl text-ink">Guest wishes</h2><p className="mt-1 text-xs text-muted">Only wishes from this event appear here.</p></div>
        <div className="flex flex-col gap-2 sm:flex-row"><label className="relative block"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input className="field min-h-10 py-2 pl-9 sm:w-56" type="search" aria-label="Search guest wishes" placeholder="Search wishes…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} /></label><select className="field min-h-10 py-2 sm:w-48" aria-label="Filter by relationship" value={relationship} onChange={(e) => { setRelationship(e.target.value); setPage(1); }}><option value="">All relationships</option><option>Family</option><option>Friends</option><option>Relatives</option><option>Not disclosed</option></select></div>
      </div>
      {loading ? <Loading label="Loading wishes…" /> : messages.length === 0 ? <div className="p-5"><EmptyState title={pagination.total === 0 ? 'No wishes just yet' : 'No wishes match these filters'}>{pagination.total === 0 ? 'Share the QR code with your guests. Their messages will arrive here.' : 'Try another search or relationship filter.'}</EmptyState></div> : <div className="divide-y divide-line/70">{messages.map((message) => <article key={message.id} className="flex gap-3 px-4 py-5 sm:gap-4 sm:px-5"><span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-blush/45 text-sm font-bold text-cocoa">{message.name.slice(0, 1).toUpperCase()}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><div><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><h3 className="text-sm font-bold text-ink">{message.name}</h3>{message.relationship && <span className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-semibold text-cocoa">{message.relationship}</span>}</div><time dateTime={message.createdAt} className="mt-1 block text-[11px] text-muted">{timeFormat.format(new Date(message.createdAt))}</time></div><button onClick={() => remove(message)} aria-label={`Delete wish from ${message.name}`} className="icon-action text-red-600 hover:bg-red-50"><Trash2 size={16} /></button></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-cocoa">{message.message}</p>{message.photoUrl && <a href={message.photoUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-xl border border-line p-2 text-xs font-semibold text-cocoa hover:bg-cream"><img src={message.photoUrl} alt={`Guest photo from ${message.name}`} className="size-14 rounded-lg object-cover" />View guest photo</a>}</div></article>)}</div>}
      {pagination.pages > 1 && <div className="flex items-center justify-between border-t border-line px-4 py-3 sm:px-5"><p className="text-xs text-muted">Page {pagination.page} of {pagination.pages} <span className="hidden sm:inline">· {pagination.total} wishes</span></p><div className="flex gap-2"><Button variant="secondary" className="px-3 py-2" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft size={16} />Previous</Button><Button variant="secondary" className="px-3 py-2" disabled={page >= pagination.pages} onClick={() => setPage((current) => Math.min(pagination.pages, current + 1))}>Next<ChevronRight size={16} /></Button></div></div>}
    </section>
  </>;
}
