'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, BookOpen, Calendar, Shield, LogOut,
  Smile, TrendingUp, PenLine, Library, Gamepad2, ArrowLeftRight, MessageSquare, ClipboardList,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useAgeTheme } from './AgeThemeProvider';
import { cn } from '@/lib/utils';

// Sidebar shows all pages
const SIDEBAR_ITEMS = [
  { href: '/client/dashboard',  label: 'Home',          childLabel: 'Home',        icon: Home },
  { href: '/client/mood',       label: 'Mood check-in', childLabel: 'My Mood',     icon: Smile },
  { href: '/client/progress',   label: 'Progress',      childLabel: 'Progress',    icon: TrendingUp },
  { href: '/client/journal',    label: 'Journal',       childLabel: 'My Diary',    icon: PenLine },
  { href: '/client/homework',    label: 'Homework',      childLabel: 'Tasks',       icon: BookOpen },
  { href: '/client/assessments', label: 'Assessments',   childLabel: 'Check-ins',   icon: ClipboardList },
  { href: '/client/sessions',   label: 'Sessions',      childLabel: 'Visits',      icon: Calendar },
  { href: '/client/resources',  label: 'Resources',     childLabel: 'Activities',  icon: Library },
  { href: '/client/games',      label: 'Games & Tools', childLabel: 'Games',       icon: Gamepad2 },
  { href: '/client/safety',     label: 'Safety plan',   childLabel: 'Get help',    icon: Shield },
  { href: '/client/messages',   label: 'Messages',      childLabel: 'Messages',    icon: MessageSquare },
];

// Bottom nav — 5 most-used pages
const BOTTOM_ITEMS = [
  { href: '/client/dashboard',  label: 'Home',    childLabel: 'Home',   icon: Home },
  { href: '/client/mood',       label: 'Mood',    childLabel: 'Mood',   icon: Smile },
  { href: '/client/journal',    label: 'Journal', childLabel: 'Diary',  icon: PenLine },
  { href: '/client/games',      label: 'Games',   childLabel: 'Games',  icon: Gamepad2 },
  { href: '/client/safety',     label: 'Safety',  childLabel: 'Help',   icon: Shield },
];

export function ClientNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, signIn, isDemoMode, clientProfile, ageGroup } = useAuthStore();
  const theme = useAgeTheme();
  const isChild = ageGroup === 'child';

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/auth/login';
  };

  return (
    <>
      {/* ── Sidebar for tablet+ ─────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r border-beige shadow-soft">
        {/* Logo */}
        <div className={cn('px-6 py-5 border-b border-beige', theme.primaryBg)}>
          <h1 className={cn('text-xl font-display font-bold', theme.primaryText)}>MindBridge</h1>
          <p className="text-xs text-text-muted mt-0.5">Your space</p>
        </div>

        {/* User */}
        {clientProfile && (
          <div className="px-6 py-4 border-b border-beige">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white text-sm mb-2',
              ageGroup === 'child' ? 'bg-coral' : ageGroup === 'teen' ? 'bg-calm' : 'bg-sage'
            )}>
              {clientProfile.first_name[0]}{clientProfile.last_name[0]}
            </div>
            <p className="text-sm font-medium text-text-primary">
              {clientProfile.preferred_name || clientProfile.first_name}
            </p>
            <p className="text-xs text-text-muted">with {clientProfile.clinician_name}</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {SIDEBAR_ITEMS.map(({ href, label, childLabel, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? cn(theme.primaryBg, theme.primaryText, 'shadow-sm')
                    : 'text-text-secondary hover:bg-sand'
                )}
              >
                <Icon className={cn('flex-shrink-0', isChild ? 'w-6 h-6' : 'w-5 h-5')} />
                <span className={isChild ? 'text-base' : ''}>{isChild ? childLabel : label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Switch portal + sign out */}
        <div className="px-3 py-4 border-t border-beige space-y-1">
          {isDemoMode && (
            <button
              onClick={async () => {
                await signIn('demo@mindbridge.com.au', 'demo123');
                window.location.href = '/dashboard';
              }}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm text-sage-dark bg-sage/10 hover:bg-sage/20 transition-all"
            >
              <ArrowLeftRight className="w-5 h-5 flex-shrink-0" />
              <span>Switch to Clinician Portal</span>
            </button>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm text-text-muted hover:text-text-secondary hover:bg-sand transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* ── Bottom nav for mobile ────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-beige z-50 flex">
        {BOTTOM_ITEMS.map(({ href, label, childLabel, icon: Icon }) => {
          const isActive = pathname === href;
          const displayLabel = isChild ? childLabel : label;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center py-2 text-xs font-medium gap-1 transition-colors',
                isActive ? theme.primaryText : 'text-text-muted'
              )}
            >
              <Icon className={isChild ? 'w-6 h-6' : 'w-5 h-5'} />
              <span className="truncate max-w-full px-1">{displayLabel}</span>
            </Link>
          );
        })}
        <button
          onClick={handleSignOut}
          className="flex-1 flex flex-col items-center justify-center py-2 text-xs text-text-muted gap-1"
        >
          <LogOut className="w-5 h-5" />
          <span>Out</span>
        </button>
      </nav>
    </>
  );
}
