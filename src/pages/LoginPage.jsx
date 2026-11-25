import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarHeart, Eye, EyeOff, Heart } from 'lucide-react';
import { useAuth } from '../lib/AuthContext.jsx';
import { Button, Field, Notice } from '../components/UI.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true); setError('');
    try { await login(email.trim(), password); navigate('/admin/dashboard', { replace: true }); }
    catch (requestError) { setError(requestError.message); }
    finally { setBusy(false); }
  }

  return <main className="grid min-h-screen bg-canvas lg:grid-cols-[1fr_1fr]">
    <section className="relative hidden overflow-hidden bg-[#684c3a] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
      <div className="absolute -right-40 top-20 size-[500px] rounded-full border border-white/10" /><div className="absolute -right-24 top-36 size-[350px] rounded-full border border-white/10" />
      <Link to="/" className="relative flex items-center gap-3"><span className="grid size-10 place-items-center rounded-2xl bg-white/15"><CalendarHeart size={20} /></span><span className="font-display text-xl">EverAfter</span></Link>
      <div className="relative max-w-lg"><p className="text-xs font-bold uppercase tracking-[.23em] text-[#e6c6a6]">For the days you keep</p><h1 className="mt-5 font-display text-5xl leading-tight">Every celebration deserves a place for its stories.</h1><p className="mt-5 max-w-md leading-7 text-white/70">Bring your events and all the wishes that make them special together in one calm, lovely space.</p><div className="mt-10 flex items-center gap-2 text-sm text-white/65"><Heart size={15} fill="currentColor" className="text-[#e6c6a6]" /> One home for every happy beginning</div></div>
      <p className="relative text-xs text-white/50">EverAfter Guestbook Studio</p>
    </section>
    <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
      <div className="w-full max-w-[420px]">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-cocoa lg:hidden"><ArrowLeft size={15} />Back to home</Link>
        <div className="mb-8 mt-10 grid size-12 place-items-center rounded-2xl bg-blush/60 text-cocoa lg:hidden"><CalendarHeart size={22} /></div>
        <p className="text-xs font-bold uppercase tracking-[.2em] text-clay">Welcome back</p>
        <h2 className="mt-2 font-display text-4xl text-ink">Sign in to your studio</h2>
        <p className="mt-3 text-sm leading-6 text-muted">Manage your celebrations, guestbooks, and the wishes in them.</p>
        {error && <div className="mt-6"><Notice>{error}</Notice></div>}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <Field label="Email address" name="email" type="email" autoComplete="username" placeholder="you@example.com" required value={email} onChange={(event) => setEmail(event.target.value)} />
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-ink">Password</label>
            <div className="relative"><input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" className="field pr-12" required value={password} onChange={(event) => setPassword(event.target.value)} /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-cocoa">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
          </div>
          <Button type="submit" className="mt-2 w-full py-3" loading={busy}>Sign in <span aria-hidden="true">→</span></Button>
        </form>
        <p className="mt-8 text-center text-xs text-muted">Your guestbook moments are waiting <span className="text-clay">♥</span></p>
      </div>
    </section>
  </main>;
}
