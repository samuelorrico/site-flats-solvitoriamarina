'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import type { Dict } from '@/dictionaries';
import type { Locale } from '@/i18n-config';
import { WA_PHONE } from '@/lib/site';

const fieldClass =
  'mt-1.5 w-full rounded-xl border border-ink/15 bg-white/70 px-4 py-3 text-ink focus:border-sea focus:ring-2 focus:ring-sea/20 outline-none';

export default function QualForm({ lang, dict }: { lang: Locale; dict: Dict }) {
  // `today` só no cliente (evita mismatch de hidratação) sem setState-em-effect.
  // Snapshot estável no mesmo dia → sem loop de render. Controla o mínimo das datas.
  const today = useSyncExternalStore(
    () => () => {},
    () => new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD no fuso local
    () => '',
  );
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [error, setError] = useState('');

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Datas: check-out tem que ser DEPOIS do check-in (comparação lexicográfica de YYYY-MM-DD).
    if (checkin && checkout && checkout <= checkin) {
      setError(dict['form.date_error']);
      return;
    }
    setError('');
    const form = e.currentTarget;
    const val = (name: string) => {
      const el = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null;
      return el && el.value ? el.value.trim() : '';
    };
    const tbd = dict['wa.tbd'];
    const msg =
      dict['wa.intro'] +
      '\n• ' + dict['wa.type'] + ': ' + (val('unit') || tbd) +
      '\n• ' + dict['wa.cin'] + ': ' + (checkin || tbd) +
      '\n• ' + dict['wa.cout'] + ': ' + (checkout || tbd) +
      '\n• ' + dict['wa.guests'] + ': ' + (val('guests') || tbd) +
      '\n• ' + dict['wa.name'] + ': ' + (val('name') || tbd);
    window.open(`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  }

  return (
    <form onSubmit={onSubmit} className="bg-sand-soft rounded-[1.75rem] p-7 sm:p-9 shadow-sm">
      <div className="grid gap-5">
        <label className="block">
          <span className="text-sm font-medium text-ink/70">{dict['form.unit']}</span>
          <select name="unit" className={fieldClass}>
            <option>{dict['form.opt1']}</option>
            <option>{dict['form.opt2']}</option>
            <option>{dict['form.opt3']}</option>
            <option>{dict['form.opt4']}</option>
            <option>{dict['form.opt5']}</option>
            <option>{dict['form.opt6']}</option>
            <option>{dict['form.opt7']}</option>
          </select>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-ink/70">{dict['form.checkin']}</span>
            <input
              name="checkin"
              type="date"
              min={today || undefined}
              value={checkin}
              onChange={(e) => {
                setCheckin(e.target.value);
                // se o check-out ficou inválido, limpa o erro só ao corrigir
                if (error) setError('');
                // se check-out < novo check-in, zera o check-out
                if (checkout && e.target.value && checkout <= e.target.value) setCheckout('');
              }}
              className={fieldClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink/70">{dict['form.checkout']}</span>
            <input
              name="checkout"
              type="date"
              min={checkin || today || undefined}
              value={checkout}
              onChange={(e) => {
                setCheckout(e.target.value);
                if (error) setError('');
              }}
              className={fieldClass}
            />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-ink/70">{dict['form.guests']}</span>
            <input
              name="guests"
              type="number"
              min={1}
              max={5}
              defaultValue={2}
              onInput={(e) => {
                const t = e.currentTarget;
                if (Number(t.value) > 5) t.value = '5';
                if (Number(t.value) < 1 && t.value !== '') t.value = '1';
              }}
              className={fieldClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink/70">{dict['form.name']}</span>
            <input name="name" type="text" placeholder={dict['form.name_ph']} className={fieldClass} />
          </label>
        </div>
        {error ? (
          <p role="alert" className="-mt-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="mt-1 inline-flex items-center justify-center gap-2 bg-sun text-sea-deep font-semibold px-6 py-3.5 rounded-xl hover:bg-sun-light transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.477-.911z" />
          </svg>
          <span>{dict['form.submit_label']}</span>
        </button>
        <p className="text-xs text-ink/70 text-center">
          {dict['form.privacy']}
          <Link href={`/${lang}/privacidade`} className="underline hover:text-sea">{dict['form.privacy_link']}</Link>.
        </p>
      </div>
    </form>
  );
}
