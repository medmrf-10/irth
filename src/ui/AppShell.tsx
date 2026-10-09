import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import './AppShell.css';

export function Header({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <div className="header">
      <div className="title">{title}</div>
      {actions}
    </div>
  );
}

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/tube" end>
        <span>☷</span>المشايخ
      </NavLink>
      <NavLink to="/tube/fav">
        <span>★</span>المفضلة
      </NavLink>
      <NavLink to="/tube/stats">
        <span>∿</span>إحصائي
      </NavLink>
    </nav>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return <main className="page">{children}</main>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="empty">{children}</div>;
}
