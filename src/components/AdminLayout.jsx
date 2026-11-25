import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CalendarHeart, ChartNoAxesCombined, ChevronRight, LogOut, Menu, Plus, X } from 'lucide-react';
import { useAuth } from '../lib/AuthContext.jsx';
import { Notice } from './UI.jsx';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: ChartNoAxesCombined },
  { to: '/admin/events/new', label: 'Create event', icon: Plus },
  { to: '/admin/events', label: 'All events', icon: CalendarHeart },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  async function handleLogout() {
    try {
      await logout();
      navigate('/admin/login', { replace: true });
    } catch (error) {
      setLogoutError(error.message);
    }
  }
  return <div className="min-h-screen bg-canvas text-ink">
    {menuOpen && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-ink/30 lg:hidden" onClick={() => setMenuOpen(false)} />}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-line bg-white px-5 py-6 transition-transform lg:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-10 flex items-center justify-between px-2">
        <NavLink to="/admin/dashboard" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <span className="grid size-10 place-items-center rounded-2xl bg-espresso text-white"><CalendarHeart size={20} /></span>
          <span><span className="block font-display text-xl leading-5">EverAfter</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-[.18em] text-muted">Guestbook studio</span></span>
        </NavLink>
        <button className="grid size-9 place-items-center rounded-lg text-muted hover:bg-cream lg:hidden" aria-label="Close navigation" onClick={() => setMenuOpen(false)}><X size={19} /></button>
      </div>
      <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-muted">Workspace</div>
      <nav className="space-y-1" aria-label="Admin navigation">
        {links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/admin/events'} onClick={() => setMenuOpen(false)} className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive ? 'bg-cream text-cocoa' : 'text-muted hover:bg-cream/70 hover:text-ink'}`}>
          {({ isActive }) => <><Icon size={18} className={isActive ? 'text-clay' : 'text-stone-400'} /><span>{label}</span>{isActive && <ChevronRight size={15} className="ml-auto" />}</>}
        </NavLink>)}
      </nav>
      {logoutError && <div className="mt-4"><Notice>{logoutError}</Notice></div>}
      <div className="mt-auto rounded-2xl bg-cream p-4">
        <div className="mb-3 flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-blush text-sm font-bold text-cocoa">{user?.email?.slice(0, 1).toUpperCase() || 'A'}</span><span className="min-w-0"><span className="block truncate text-xs font-bold text-ink">Administrator</span><span className="block truncate text-[11px] text-muted">{user?.email}</span></span></div>
        <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-muted hover:bg-white hover:text-ink"><LogOut size={15} />Sign out</button>
      </div>
    </aside>
    <div className="lg:pl-[280px]">
      <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-line/80 bg-canvas/90 px-5 backdrop-blur sm:px-8 lg:px-10">
        <button onClick={() => setMenuOpen(true)} aria-label="Open navigation" className="grid size-10 place-items-center rounded-xl border border-line bg-white text-cocoa lg:hidden"><Menu size={19} /></button>
        <div className="hidden text-sm text-muted sm:block">A little joy, beautifully kept.</div>
        <NavLink to="/" className="text-xs font-semibold text-muted hover:text-cocoa">View home ↗</NavLink>
      </header>
      <main className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10"><Outlet /></main>
    </div>
  </div>;
}
