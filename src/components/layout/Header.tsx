'use client';

import { Bell, Search, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="bg-white border-b border-beige px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-text-primary">{title}</h1>
          {subtitle && <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search clients, notes..."
              className="w-64 pl-10 pr-4 py-2 border border-beige rounded-lg bg-sand text-sm focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-text-secondary hover:bg-sand rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-coral rounded-full" />
          </button>

          {/* Help */}
          <button className="p-2 text-text-secondary hover:bg-sand rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Custom Actions */}
          {actions}
        </div>
      </div>
    </header>
  );
}
