import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Check, Copy, ExternalLink, QrCode, Save } from 'lucide-react';
import { api, qrUrl } from '../lib/api.js';
import { Button, Field, Loading, Notice, PageHeading } from '../components/UI.jsx';

const initialForm = { coupleNames: '', title: '', description: '', eventDate: '', isActive: true };

export default function EventFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [form, setForm] = useState(initialForm);
  const [created, setCreated] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(editing);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!editing) return;
    api(`/admin/events/${id}`).then(({ event }) => setForm({
      coupleNames: event.coupleNames,
      title: event.title,
      description: event.description,
      eventDate: event.eventDate ? new Date(event.eventDate).toISOString().slice(0, 10) : '',
      isActive: event.isActive,
    })).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false));
  }, [id, editing]);

  function update(key, value) { setForm((current) => ({ ...current, [key]: value })); }

  async function handleSubmit(event) {
    event.preventDefault(); setBusy(true); setError(''); setFieldErrors({});
    try {
      const result = await api(editing ? `/admin/events/${id}` : '/admin/events', {
        method: editing ? 'PUT' : 'POST', body: JSON.stringify({ ...form, eventDate: form.eventDate || '' }),
      });
      if (editing) navigate(`/admin/events/${id}`, { replace: true });
      else setCreated(result.event);
    } catch (requestError) {
      setError(requestError.message); setFieldErrors(requestError.fields || {});
    } finally { setBusy(false); }
  }

  async function copyLink() {
    if (!created) return;
    try { await navigator.clipboard.writeText(created.publicUrl); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { setError('The link could not be copied. Select and copy it instead.'); }
  }

  if (loading) return <Loading label="Opening event details…" />;
  return <>
    <Link to={editing ? `/admin/events/${id}` : '/admin/events'} className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-cocoa"><ArrowLeft size={15} />{editing ? 'Back to event' : 'All events'}</Link>
    <PageHeading eyebrow={editing ? 'Event settings' : 'Your next celebration'} title={editing ? 'Edit event' : 'Create an event'} description={editing ? 'Update the details guests see on the public guestbook.' : 'Start with the details that make this celebration yours.'} />
    {error && <div className="mb-5"><Notice>{error}</Notice></div>}
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(300px,.7fr)]">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-white p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-3 border-b border-line/70 pb-5"><span className="grid size-10 place-items-center rounded-xl bg-cream text-clay"><CalendarDays size={19} /></span><div><h2 className="font-display text-xl">Celebration details</h2><p className="mt-0.5 text-xs text-muted">These details appear on your guest page.</p></div></div>
        <div className="space-y-5">
          <Field label="Couple's names" name="coupleNames" placeholder="e.g. Asha & Rohan" maxLength={120} required value={form.coupleNames} onChange={(event) => update('coupleNames', event.target.value)} error={fieldErrors.coupleNames?.[0]} hint="The names guests will see at the top of the page." />
          <Field label="Event title" name="title" placeholder="Wedding Celebration" maxLength={120} required value={form.title} onChange={(event) => update('title', event.target.value)} error={fieldErrors.title?.[0]} />
          <Field label="Welcome message" name="description" placeholder="We’re so glad you’re here. Leave us a wish to remember." maxLength={300} required value={form.description} onChange={(event) => update('description', event.target.value)} error={fieldErrors.description?.[0]} hint="A warm, short line to welcome your guests." />
          <Field label="Event date" name="eventDate" type="date" value={form.eventDate} onChange={(event) => update('eventDate', event.target.value)} error={fieldErrors.eventDate?.[0]} hint="Optional. Add a date to help guests remember the day." />
          {editing && <label className="flex items-center gap-3 rounded-xl border border-line bg-cream/40 px-4 py-3"><input type="checkbox" className="size-4 accent-[#704a35]" checked={form.isActive} onChange={(event) => update('isActive', event.target.checked)} /><span><span className="block text-sm font-semibold text-ink">Accept guest wishes</span><span className="mt-0.5 block text-xs text-muted">Turn this off to close the public guestbook.</span></span></label>}
        </div>
        <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-line/70 pt-5"><Link to={editing ? `/admin/events/${id}` : '/admin/events'}><Button variant="secondary">Cancel</Button></Link><Button type="submit" loading={busy} disabled={!editing && Boolean(created)}><Save size={16} />{editing ? 'Save changes' : created ? 'Event created' : 'Create event'}</Button></div>
      </form>
      <aside className="rounded-2xl border border-line bg-[#f1ece4] p-5 sm:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-clay">A little preview</p>
        <div className="mt-4 rounded-2xl border border-white bg-white px-5 py-7 text-center shadow-sm"><span className="mx-auto grid size-11 place-items-center rounded-full bg-blush/50 text-clay">♥</span><p className="mt-4 font-display text-2xl text-ink">{form.coupleNames || 'Your names here'}</p><p className="mt-2 text-xs text-muted">{form.description || 'Your welcome message will appear here.'}</p><div className="mx-auto mt-5 h-px max-w-36 bg-line" /><p className="mt-4 text-[10px] font-bold uppercase tracking-[.16em] text-clay">{form.title || 'Event title'}</p></div>
        <div className="mt-5 flex gap-2 rounded-xl border border-white/80 bg-white/65 p-3 text-xs leading-5 text-muted"><QrCode size={17} className="mt-0.5 shrink-0 text-clay" /><p>A unique QR code and guest link are ready as soon as your event is created.</p></div>
      </aside>
    </div>

    {created && <section className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 sm:p-7">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="rounded-2xl bg-white p-3 shadow-sm"><img src={qrUrl(created.id)} alt={`QR code for ${created.coupleNames} guestbook`} className="size-36 rounded-lg sm:size-40" /></div>
        <div className="min-w-0 flex-1"><div className="flex items-center gap-2 text-forest"><span className="grid size-7 place-items-center rounded-full bg-emerald-100"><Check size={15} /></span><span className="text-xs font-bold uppercase tracking-[.16em]">Your event is ready</span></div><h2 className="mt-2 font-display text-2xl text-ink">{created.coupleNames}</h2><p className="mt-1 text-sm text-muted">{created.title} · Share this page with your guests.</p>
          <div className="mt-4 flex flex-wrap items-center gap-2"><a className="max-w-full truncate rounded-lg border border-line bg-white px-3 py-2 text-xs text-cocoa" href={created.publicUrl} target="_blank" rel="noreferrer">{created.publicUrl}</a><Button variant="secondary" className="px-3 py-2" onClick={copyLink}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copied' : 'Copy'}</Button></div>
          <div className="mt-4 flex flex-wrap gap-2"><a href={qrUrl(created.id, 'png', true)}><Button><QrCode size={15} />Download QR</Button></a><Link to={`/admin/events/${created.id}`}><Button variant="secondary"><ExternalLink size={15} />View messages</Button></Link><a href={qrUrl(created.id, 'svg', true)}><Button variant="ghost">Download SVG</Button></a></div>
        </div>
      </div>
    </section>}
  </>;
}
