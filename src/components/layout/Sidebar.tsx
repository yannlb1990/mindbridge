'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { Avatar } from '@/components/ui/Avatar';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Mic,
  ClipboardList,
  Shield,
  BookOpen,
  Sparkles,
  FileStack,
  Link2,
  ArrowLeftRight,
  UserCheck,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Clinical Notes', href: '/notes', icon: FileText },
  { name: 'Session Capture', href: '/session-capture', icon: Mic, isNew: true },
  { name: 'AI Insights', href: '/insights', icon: Sparkles, isNew: true },
  { name: 'Assessments', href: '/assessments', icon: ClipboardList },
  { name: 'Templates', href: '/templates', icon: FileStack, isNew: true },
  { name: 'Library', href: '/library', icon: BookOpen },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Waitlist', href: '/waitlist', icon: UserCheck },
];

const secondaryNavigation = [
  { name: 'Integrations', href: '/integrations', icon: Link2, isNew: true },
  { name: 'Safety Plans', href: '/safety-plans', icon: Shield },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, clinicianProfile, signOut, signIn, isDemoMode } = useAuthStore();

  const displayName = user?.preferred_name || `${user?.first_name} ${user?.last_name}`;

  return (
    <aside className="flex flex-col w-64 bg-white border-r border-beige h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-beige">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sage rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="font-display font-bold text-xl text-sage-dark">MindBridge</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const isNew = 'isNew' in item && item.isNew;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sage-50 text-sage-dark'
                      : 'text-text-secondary hover:bg-sand hover:text-text-primary'
                  )}
                >
                  <item.icon className={cn('w-5 h-5', isActive ? 'text-sage' : '')} />
                  {item.name}
                  {isNew && (
                    <span className="ml-auto text-[10px] font-bold uppercase px-1.5 py-0.5 bg-sage text-white rounded">
                      New
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8">
          <p className="px-3 text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
            More
          </p>
          <ul className="space-y-1">
            {secondaryNavigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const isNew = 'isNew' in item && item.isNew;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sage-50 text-sage-dark'
                        : 'text-text-secondary hover:bg-sand hover:text-text-primary'
                    )}
                  >
                    <item.icon className={cn('w-5 h-5', isActive ? 'text-sage' : '')} />
                    {item.name}
                    {isNew && (
                      <span className="ml-auto text-[10px] font-bold uppercase px-1.5 py-0.5 bg-sage text-white rounded">
                        New
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-beige space-y-2">
        {/* Switch to client portal (demo mode only) */}
        {isDemoMode && (
          <button
            onClick={async () => {
              await signIn('client@mindbridge.com.au', 'client123');
              window.location.href = '/client/dashboard';
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-calm-dark bg-calm/10 hover:bg-calm/20 transition-colors"
          >
            <ArrowLeftRight className="w-4 h-4 flex-shrink-0" />
            <span>Switch to Client Portal</span>
          </button>
        )}

        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sand transition-colors">
          <Avatar
            src={user?.avatar_url}
            firstName={user?.first_name || 'U'}
            lastName={user?.last_name || 'U'}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{displayName}</p>
            <p className="text-xs text-text-muted truncate">{clinicianProfile?.credentials}</p>
          </div>
          <button
            onClick={async () => { await signOut(); window.location.href = '/auth/login'; }}
            className="p-2 text-text-muted hover:text-coral-dark hover:bg-coral/10 rounded-lg transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
