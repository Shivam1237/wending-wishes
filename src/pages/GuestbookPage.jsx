import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarDays, Check, Heart, ImagePlus, Sparkles } from 'lucide-react';
import { api } from '../lib/api.js';
import { Button, Field, Loading, Notice } from '../components/UI.jsx';

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'long' });

export default function GuestbookPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [form, setForm] = useState({ name: '', relationship: '', message: '' });
  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const submissionId = useRef(window.crypto.randomUUID());

  useEffect(() => {
    api(`/public/events/${encodeURIComponent(slug)}`).then((result) => setEvent({ ...result.event, photoUpload: result.photoUpload }))
      .catch((requestError) => { if (requestError.status === 404) setNotFound(true); else setLoadError(requestError.message); })
      .finally(() => setLoading(false));
  }, [slug]);

  function choosePhoto(file) {
    setPhotoError('');
    if (!file) { setPhoto(null); return; }
    if (file.size > MAX_PHOTO_SIZE) { setPhoto(null); setPhotoError('Choose a photo smaller than 5 MB.'); return; }
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.has(file.type) && !['jpg', 'jpeg', 'png', 'webp'].includes(ext)) { setPhoto(null); setPhotoError('Choose a JPEG, PNG, or WebP image.'); return; }
    setPhoto(file);
  }

  async function handleSubmit(submitEvent) {
    submitEvent.preventDefault(); setBusy(true); setError(''); setFieldErrors({});
    if (photoError) { setBusy(false); return; }
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = ['Please add your name.'];
    if (form.name.trim().length > 100) nextErrors.name = ['Please keep your name under 100 characters.'];
    if (!form.message.trim()) nextErrors.message = ['Please write a wish for the couple.'];
    if (form.message.trim().length > 2000) nextErrors.message = ['Please keep your wish under 2,000 characters.'];
    if (Object.keys(nextErrors).length) { setFieldErrors(nextErrors); setBusy(false); return; }

    const body = new FormData();
    body.append('name', form.name.trim());
    body.append('relationship', form.relationship);
    body.append('message', form.message.trim());
    if (photo) body.append('photo', photo);
    try {
      await api(`/public/events/${encodeURIComponent(slug)}/messages`, { method: 'POST', headers: { 'Idempotency-Key': submissionId.current }, body });
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError.message); setFieldErrors(requestError.fields || {});
    } finally { setBusy(false); }
  }

  if (loading) return <main className="grid min-h-screen place-items-center bg-[#f8f5ef]"><Loading label="Opening the guestbook…" /></main>;
  if (notFound) return <GuestMessage title="This guestbook has wandered off" text="We couldn’t find that celebration. Please check the QR code or link and try again." />;
  if (loadError) return <GuestMessage title="We couldn’t open this guestbook" text={loadError} />;
  if (!event) return null;

  return <main className="relative min-h-screen overflow-hidden bg-[#f8f5ef] px-4 py-8 sm:px-6 sm:py-12">
    <div className="pointer-events-none absolute -left-28 top-20 size-64 rounded-full bg-[#ead8c8]/30 blur-3xl" /><div className="pointer-events-none absolute -right-28 bottom-16 size-72 rounded-full bg-[#e8e9db]/50 blur-3xl" />
    <div className="relative mx-auto max-w-[580px]">
      <header className="mb-7 text-center sm:mb-9">
        <span className="mx-auto grid size-12 place-items-center rounded-full border border-[#e7d8ca] bg-white/70 text-[#a97553]"><Heart size={19} fill="currentColor" /></span>
        <p className="mt-5 text-[10px] font-bold uppercase tracking-[.24em] text-[#a97553]">{event.title}</p>
        <h1 className="mt-3 font-display text-[38px] leading-tight tracking-tight text-[#49382d] sm:text-[48px]">{event.coupleNames.split(/\s+(?:&|and)\s+/i).map((name, index) => <span key={`${name}-${index}`}>{index > 0 && <span aria-label="and" className="mx-2 inline-block text-[#ae7e5b]">♥</span>}{name}</span>)}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#80746c]">{event.description}</p>
        {event.eventDate && <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#8f7868]"><CalendarDays size={13} />{dateFormat.format(new Date(event.eventDate))}</p>}
      </header>

      {!event.isActive ? <div className="rounded-[24px] border border-white bg-white p-7 text-center shadow-[0_20px_60px_-38px_rgba(75,53,38,.38)] sm:p-10"><span className="mx-auto grid size-12 place-items-center rounded-full bg-[#f4efe7] text-[#a97553]"><Heart size={19} /></span><h2 className="mt-4 font-display text-2xl text-[#49382d]">This guestbook is currently closed</h2><p className="mt-2 text-sm leading-6 text-[#80746c]">Thank you for celebrating with {event.coupleNames}. We’re keeping all the lovely wishes safe.</p></div> : submitted ? <div className="rounded-[24px] border border-white bg-white px-7 py-10 text-center shadow-[0_20px_60px_-38px_rgba(75,53,38,.38)] sm:px-10 sm:py-14"><span className="mx-auto grid size-14 place-items-center rounded-full bg-[#e7eee5] text-[#50705c]"><Check size={23} /></span><h2 className="mt-5 font-display text-3xl text-[#49382d]">Your wish is tucked in</h2><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#80746c]">Thank you, {form.name.trim()}. Your kind words are now part of their story.</p><div className="mt-6 text-xl text-[#ae7e5b]">♥</div></div> : <form onSubmit={handleSubmit} className="rounded-[24px] border border-white bg-white px-5 py-7 shadow-[0_20px_60px_-38px_rgba(75,53,38,.38)] sm:px-9 sm:py-9">
        <div className="mb-6 border-b border-[#eee8e1] pb-5"><h2 className="font-display text-2xl text-[#49382d]">Leave a little love</h2><p className="mt-1.5 text-xs text-[#8a7d74]">A kind word they can come back to, always.</p></div>
        {error && <div className="mb-5"><Notice>{error}</Notice></div>}
        {event.photoUpload?.configured === false && <div role="alert" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">{event.photoUpload.error}</div>}
        <div className="space-y-5">
          <Field label="Your Name *" name="guest-name" placeholder="What should we call you?" autoComplete="name" maxLength={100} required value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} error={fieldErrors.name?.[0]} />
          <Field label="Your Relationship (Optional)" name="guest-relationship"><select id="guest-relationship" className="field" value={form.relationship} onChange={(e) => setForm((current) => ({ ...current, relationship: e.target.value }))}><option value="">Choose if you’d like</option><option>Family</option><option>Friends</option><option>Relatives</option><option value="Not disclosed">Prefer not to disclose</option></select></Field>
          <Field label="Your Wishes *" name="guest-message" error={fieldErrors.message?.[0]}><textarea id="guest-message" className={`field min-h-32 ${fieldErrors.message ? 'field-error' : ''}`} placeholder="Write a wish, a memory, or a few kind words…" maxLength={2000} required value={form.message} onChange={(e) => setForm((current) => ({ ...current, message: e.target.value }))} /></Field>
          <div><span className="mb-2 block text-sm font-semibold text-[#49382d]">Upload Your Photo <span className="font-normal text-[#8a7d74]">(Optional — Max 5 MB)</span></span><label htmlFor="guest-photo" className={`flex min-h-[64px] cursor-pointer items-center gap-3 rounded-xl border border-dashed px-4 py-3 transition hover:border-[#b48b6d] hover:bg-[#fcfaf7] ${photoError ? 'border-red-300 bg-red-50/50' : 'border-[#ded4c9] bg-[#fdfcfb]'}`}><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#f1e9e0] text-[#92684b]"><ImagePlus size={18} /></span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-[#604c3e]">{photo?.name || 'Choose a photo to share'}</span><span className="mt-1 block text-[10px] text-[#8a7d74]">JPEG, PNG or WebP · up to 5 MB</span></span><input id="guest-photo" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" className="sr-only" onChange={(e) => choosePhoto(e.target.files?.[0])} /></label>{photoError && <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">{photoError}</p>}{photo && <button type="button" onClick={() => { setPhoto(null); document.getElementById('guest-photo').value = ''; }} className="mt-2 text-xs font-semibold text-[#8f6344] underline">Remove photo</button>}</div>
        </div>
        <Button type="submit" loading={busy} className="mt-7 w-full rounded-xl bg-[#704a35] py-3.5 text-[15px] hover:bg-[#5e3d2b]">{busy ? 'Sending your wish…' : <>Send Wishes <Heart size={16} fill="currentColor" /></>}</Button>
        <p className="mt-5 text-center text-[11px] text-[#8a7d74]">Made with <span className="text-[#ad7652]">♥</span> for a beautiful beginning</p>
      </form>}
      <footer className="mt-7 text-center text-[10px] tracking-wide text-[#9a8d82]">A little love, kept forever <span className="px-1 text-[#ad7652]">♥</span></footer>
    </div>
  </main>;
}

function GuestMessage({ title, text }) {
  return <main className="grid min-h-screen place-items-center bg-[#f8f5ef] px-5"><div className="max-w-md rounded-[24px] border border-white bg-white p-8 text-center shadow-lg"><span className="mx-auto grid size-12 place-items-center rounded-full bg-[#f4efe7] text-[#a97553]"><Sparkles size={20} /></span><h1 className="mt-5 font-display text-2xl text-[#49382d]">{title}</h1><p className="mt-3 text-sm leading-6 text-[#80746c]">{text}</p><p className="mt-6 text-xs text-[#9a8d82]">Made with <span className="text-[#ad7652]">♥</span> for a beautiful beginning</p></div></main>;
}
