import { LoaderCircle, Sparkles } from 'lucide-react';

export function Button({ children, variant = 'primary', className = '', type = 'button', loading = false, disabled = false, ...props }) {
  const variants = {
    primary: 'bg-espresso text-white hover:bg-cocoa shadow-sm',
    secondary: 'bg-white text-ink border border-line hover:bg-cream',
    ghost: 'text-muted hover:bg-cream hover:text-ink',
    danger: 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-100',
  };
  return <button type={type} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 ${variants[variant]} ${className}`} disabled={loading || disabled} {...props}>
    {loading && <LoaderCircle size={16} className="animate-spin" />}{children}
  </button>;
}

export function Field({ label, hint, error, className = '', children, ...props }) {
  const id = props.id || props.name;
  return <label className={`block ${className}`} htmlFor={id}>
    <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
    {children || <input id={id} className={`field ${error ? 'field-error' : ''}`} {...props} />}
    {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    {error && <span role="alert" className="mt-1.5 block text-xs font-medium text-red-700">{error}</span>}
  </label>;
}

export function Notice({ children, tone = 'error', onClose }) {
  const colors = tone === 'success' ? 'border-sage/30 bg-sage/10 text-forest' : 'border-red-200 bg-red-50 text-red-800';
  return <div role={tone === 'error' ? 'alert' : 'status'} className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${colors}`}>
    {tone === 'success' && <Sparkles size={17} className="mt-0.5 shrink-0" />}
    <span>{children}</span>
    {onClose && <button type="button" className="ml-auto text-xs underline" onClick={onClose}>Dismiss</button>}
  </div>;
}

export function Loading({ label = 'Loading…', full = false }) {
  return <div className={`flex items-center justify-center gap-2 text-sm text-muted ${full ? 'min-h-[50vh]' : 'py-12'}`}><LoaderCircle className="animate-spin" size={18} />{label}</div>;
}

export function EmptyState({ title, children, action }) {
  return <div className="rounded-2xl border border-dashed border-line bg-white/70 px-6 py-12 text-center">
    <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-cream text-cocoa"><Sparkles size={21} /></div>
    <h3 className="font-display text-xl text-ink">{title}</h3>
    {children && <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">{children}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>;
}

export function StatusBadge({ active }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${active ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-600'}`}>
    <span className={`size-1.5 rounded-full ${active ? 'bg-emerald-600' : 'bg-stone-400'}`} />{active ? 'Active' : 'Closed'}
  </span>;
}

export function PageHeading({ eyebrow, title, description, action }) {
  return <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-clay">{eyebrow}</p><h1 className="font-display text-3xl text-ink sm:text-4xl">{title}</h1>{description && <p className="mt-2 max-w-xl text-sm leading-6 text-muted">{description}</p>}</div>
    {action}
  </div>;
}
