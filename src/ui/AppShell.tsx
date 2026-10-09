import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { IconClose, IconFav, IconSearch, IconSheikhs, IconStats, IconTheme } from './icons';
import { useToast } from './toast';
import { useUser } from '../user/store';
import type { ThemeId } from '../data/types';
import './AppShell.css';

const THEMES: { id: ThemeId; name: string; color: string }[] = [
  { id: 'paper', name: 'ورق', color: '#F4EEE2' },
  { id: 'night', name: 'ليل', color: '#14110E' },
];

/** الترويسة الزجاجية: شعار + بحث + ثيم، وشريط بحث منبثق. */
export function TopBar({
  search,
  onSearch,
  placeholder,
}: {
  search?: { value: string };
  onSearch?: (q: string) => void;
  placeholder?: string;
}) {
  const theme = useUser((s) => s.theme);
  const setTheme = useUser((s) => s.setTheme);
  const [sOpen, setSOpen] = useState(false);
  const [tOpen, setTOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.themes, .ib.tbtn')) setTOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  return (
    <header className="top">
      <Link to="/tube" className="brand">
        <img src="/irth/icons/icon-192.png" alt="" />
        <b>إرث</b>
      </Link>
      <div className="acts">
        <button
          className="ib"
          aria-label="بحث"
          onClick={() => {
            setSOpen(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
        >
          <IconSearch />
        </button>
        <button
          className="ib tbtn"
          aria-label="الشكل"
          onClick={(e) => {
            e.stopPropagation();
            setTOpen((v) => !v);
          }}
        >
          <IconTheme />
        </button>
      </div>
      {sOpen && (
        <div className="sbar">
          <input
            ref={inputRef}
            type="search"
            placeholder={placeholder ?? 'ابحث'}
            autoComplete="off"
            value={search?.value ?? ''}
            onChange={(e) => onSearch?.(e.target.value)}
          />
          <button
            className="ib"
            aria-label="إغلاق البحث"
            onClick={() => {
              setSOpen(false);
              onSearch?.('');
            }}
          >
            <IconClose />
          </button>
        </div>
      )}
      {tOpen && (
        <div className="themes">
          {THEMES.map((t) => (
            <button
              key={t.id}
              aria-pressed={theme === t.id}
              onClick={() => {
                setTheme(t.id);
                localStorage.setItem('irth.theme', t.id);
                setTOpen(false);
              }}
            >
              <i style={{ background: t.color }} />
              {t.name}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

/** الشريط السفلي — أيقونات SVG كبيرة مثل التصميم المعتمد. */
export function BottomNav() {
  return (
    <nav className="nav">
      <NavLink to="/tube" end className={({ isActive }) => (isActive ? 'on' : '')}>
        <IconSheikhs />
        <span>المشايخ</span>
      </NavLink>
      <NavLink to="/tube/fav" className={({ isActive }) => (isActive ? 'on' : '')}>
        <IconFav />
        <span>المفضلة</span>
      </NavLink>
      <NavLink to="/tube/stats" className={({ isActive }) => (isActive ? 'on' : '')}>
        <IconStats />
        <span>إحصائي</span>
      </NavLink>
    </nav>
  );
}

export function Toast() {
  const text = useToast((s) => s.text);
  return <div className={`toast${text ? ' on' : ''}`}>{text}</div>;
}

export function Page({ children }: { children: ReactNode }) {
  return <main>{children}</main>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>;
}
