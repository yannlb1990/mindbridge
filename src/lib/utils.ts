import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, format: 'short' | 'long' | 'time' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (format === 'time') {
    return d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
  }

  if (format === 'long') {
    return d.toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return d.toLocaleDateString('en-AU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDate(d);
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export function getRiskLevelColor(level: string): string {
  const colors: Record<string, string> = {
    low: 'text-sage bg-sage-50',
    moderate: 'text-gold-dark bg-gold/20',
    high: 'text-coral-dark bg-coral/20',
    critical: 'text-red-700 bg-red-100',
  };
  return colors[level] || colors.low;
}

export function getMoodEmoji(rating: number): string {
  const emojis: Record<number, string> = {
    1: '😢',
    2: '😕',
    3: '😐',
    4: '🙂',
    5: '😊',
  };
  return emojis[rating] || '😐';
}

export function getMoodLabel(rating: number): string {
  const labels: Record<number, string> = {
    1: 'Struggling',
    2: 'Low',
    3: 'Neutral',
    4: 'Good',
    5: 'Great',
  };
  return labels[rating] || 'Neutral';
}
