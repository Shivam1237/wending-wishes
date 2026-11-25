import { Link } from 'react-router-dom';
import { ArrowRight, Heart, QrCode, Sparkles } from 'lucide-react';

export default function HomePage() {
  return <main className="relative min-h-screen overflow-hidden bg-canvas px-5 py-6 sm:px-10">
    <div className="absolute -right-36 -top-36 size-[420px] rounded-full bg-blush/40 blur-3xl" />
    <div className="absolute -bottom-40 -left-28 size-[420px] rounded-full bg-sage/20 blur-3xl" />
    <header className="relative mx-auto flex max-w-7xl items-center justify-between">
      <Link to="/" className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-2xl bg-espresso text-white"><Heart size={19} fill="currentColor" /></span><span className="font-display text-xl">EverAfter</span></Link>
      <Link to="/admin/login" className="rounded-xl border border-line bg-white/75 px-4 py-2.5 text-sm font-semibold text-cocoa transition hover:bg-white">Admin sign in</Link>
    </header>
    <section className="relative mx-auto grid min-h-[calc(100vh-110px)] max-w-7xl items-center gap-12 py-14 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-2 text-xs font-semibold text-cocoa"><Sparkles size={14} className="text-clay" />A keepsake for your beginning</span>
        <h1 className="mt-7 font-display text-5xl leading-[1.07] tracking-tight text-ink sm:text-6xl lg:text-[72px]">Every wish, a little piece of <span className="italic text-clay">forever.</span></h1>
        <p className="mt-6 max-w-lg text-base leading-7 text-muted sm:text-lg">A thoughtful digital guestbook for wedding celebrations. Share a QR code, gather heartfelt wishes, and keep every memory close.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link to="/admin/login" className="inline-flex items-center gap-2 rounded-xl bg-espresso px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-cocoa">Open your workspace <ArrowRight size={16} /></Link><a href="#how-it-works" className="rounded-xl border border-line bg-white/70 px-5 py-3 text-sm font-semibold text-cocoa hover:bg-white">How it works</a></div>
        <div className="mt-12 flex items-center gap-4 text-xs text-muted"><span className="flex -space-x-2"><span className="grid size-8 place-items-center rounded-full border-2 border-canvas bg-blush text-cocoa"><Heart size={13} fill="currentColor" /></span><span className="grid size-8 place-items-center rounded-full border-2 border-canvas bg-sage/50 text-forest"><Sparkles size={13} /></span></span><span>Made for your most meaningful day</span></div>
      </div>
      <div className="relative mx-auto w-full max-w-[510px]">
        <div className="absolute -left-6 top-12 z-10 hidden rounded-2xl border border-white/80 bg-white/85 p-4 shadow-lg backdrop-blur sm:block"><div className="grid size-10 place-items-center rounded-xl bg-cream text-cocoa"><QrCode size={20} /></div><p className="mt-3 text-xs font-bold text-ink">One scan to share</p><p className="mt-1 text-[11px] text-muted">Your guests are just a tap away</p></div>
        <div className="absolute -right-5 bottom-20 z-10 hidden rounded-2xl border border-white/80 bg-white/85 px-4 py-3 shadow-lg backdrop-blur sm:block"><p className="font-display text-2xl text-cocoa">With love,</p><p className="mt-0.5 text-[11px] text-muted">from everyone who came</p></div>
        <div className="rounded-[34px] border border-white/80 bg-white/65 p-3 shadow-[0_30px_90px_-30px_rgba(77,56,42,.3)] backdrop-blur sm:p-5">
          <div className="rounded-[27px] border border-line/70 bg-[#fcfaf7] px-6 py-9 text-center sm:px-10 sm:py-12">
            <div className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-blush/60 text-clay"><Heart size={22} fill="currentColor" /></div>
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-clay">A day to remember</p>
            <div className="mt-5 font-display text-[34px] leading-tight text-ink sm:text-[40px]">Your story<span className="mx-2 inline-block text-clay">&</span>theirs</div>
            <p className="mx-auto mt-3 max-w-[260px] text-sm leading-6 text-muted">A little note, a kind wish, a memory to carry with you.</p>
            <div className="mx-auto my-7 h-px max-w-[210px] bg-line" />
            <div className="space-y-4 text-left">
              <div className="h-11 rounded-xl border border-line bg-white px-3 py-3 text-xs text-stone-400">Your name</div>
              <div className="h-11 rounded-xl border border-line bg-white px-3 py-3 text-xs text-stone-400">Your relationship</div>
              <div className="h-24 rounded-xl border border-line bg-white px-3 py-3 text-xs text-stone-400">Your wishes for the couple…</div>
              <div className="rounded-xl bg-espresso py-3 text-center text-sm font-semibold text-white">Send wishes <span className="ml-1 text-blush">♥</span></div>
            </div>
            <p className="mt-6 text-[10px] text-muted">Made with <span className="text-clay">♥</span> for a beautiful beginning</p>
          </div>
        </div>
      </div>
    </section>
    <section id="how-it-works" className="relative mx-auto grid max-w-7xl gap-4 border-t border-line/80 py-10 sm:grid-cols-3">
      {[['01', 'Create an event', 'Add your celebration details and choose a date.'], ['02', 'Share your QR', 'Print or share a unique code with your guests.'], ['03', 'Keep every wish', 'Read, download, and revisit every message.']].map(([number, title, desc]) => <div key={number} className="rounded-2xl border border-line/70 bg-white/55 p-5"><span className="text-xs font-bold tracking-[.2em] text-clay">{number}</span><h2 className="mt-3 font-display text-xl text-ink">{title}</h2><p className="mt-2 text-sm leading-6 text-muted">{desc}</p></div>)}
    </section>
    <footer className="relative border-t border-line/80 py-5 text-center text-xs text-muted">EverAfter <span className="px-1 text-clay">♥</span> for the days you keep forever</footer>
  </main>;
}
