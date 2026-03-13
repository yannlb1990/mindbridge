'use client';

import { useAuthStore } from '@/stores/authStore';
import { useAgeTheme } from '@/components/client/AgeThemeProvider';
import { useSafetyPlans, AUSTRALIAN_CRISIS_RESOURCES } from '@/hooks/useSafetyPlans';
import { cn } from '@/lib/utils';
import { Shield, Phone, Heart, AlertTriangle, Loader2 } from 'lucide-react';

export default function ClientSafetyPage() {
  const { ageGroup } = useAuthStore();
  const theme = useAgeTheme();
  const { safetyPlans, isLoading } = useSafetyPlans();
  const isChild = ageGroup === 'child';
  const isTeen = ageGroup === 'teen';

  const plan = safetyPlans[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-sage" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

      {/* Header */}
      <div className={cn('rounded-2xl p-5 border-2', theme.primaryBorder, theme.primaryBg)}>
        <div className="flex items-center gap-3 mb-2">
          <Shield className={cn(isChild ? 'w-8 h-8' : 'w-6 h-6', theme.primaryText)} />
          <h1 className={cn('font-display font-bold text-text-primary', isChild ? 'text-2xl' : 'text-xl')}>
            {isChild ? 'Help & Safety' : isTeen ? 'Your Support' : 'Safety Plan'}
          </h1>
        </div>
        <p className={cn('text-text-secondary', isChild ? 'text-base' : 'text-sm')}>
          {isChild
            ? 'If you feel really sad, scared, or want to hurt yourself — you can always talk to someone. You are never alone.'
            : isTeen
            ? 'If things feel overwhelming, reach out to someone on this list. You are not alone.'
            : 'Your personalised safety plan with people to contact and strategies to use in times of distress.'}
        </p>
      </div>

      {/* Emergency — always shown first and prominently */}
      <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <h2 className={cn('font-bold text-red-800', isChild ? 'text-xl' : 'text-base')}>
            {isChild ? 'In an emergency:' : 'Emergency'}
          </h2>
        </div>
        <a
          href="tel:000"
          className="flex items-center justify-between bg-red-600 text-white rounded-xl px-5 py-4 font-bold hover:bg-red-700 transition-colors"
        >
          <span className={isChild ? 'text-xl' : 'text-lg'}>
            {isChild ? 'Call 000 (Emergency)' : 'Emergency Services — 000'}
          </span>
          <Phone className="w-6 h-6" />
        </a>
      </div>

      {/* People who care */}
      {plan?.social_contacts && plan.social_contacts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-soft p-5">
          <div className="flex items-center gap-2 mb-4">
            <Heart className={cn(isChild ? 'w-6 h-6' : 'w-5 h-5', theme.primaryText)} />
            <h2 className={cn('font-semibold text-text-primary', isChild ? 'text-xl' : 'text-base')}>
              {isChild ? 'People who love you' : isTeen ? 'People who care about you' : 'Personal contacts'}
            </h2>
          </div>
          <div className="space-y-3">
            {plan.social_contacts.map((contact, i) => (
              <div key={i} className={cn('flex items-center justify-between p-4 rounded-xl', theme.accentBg)}>
                <div>
                  <p className={cn('font-semibold text-text-primary', isChild ? 'text-lg' : 'text-sm')}>
                    {contact.name}
                  </p>
                  <p className="text-xs text-text-muted">{contact.relationship}</p>
                </div>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all',
                    isChild ? 'text-base py-3' : 'text-sm',
                    theme.primaryButton
                  )}
                >
                  <Phone className="w-4 h-4" />
                  {isChild ? 'Call' : contact.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional contacts */}
      {plan?.professional_contacts && plan.professional_contacts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-soft p-5">
          <h2 className={cn('font-semibold text-text-primary mb-4', isChild ? 'text-xl' : 'text-base')}>
            {isChild ? 'My helpers' : 'Professional support'}
          </h2>
          <div className="space-y-3">
            {plan.professional_contacts.map((contact, i) => (
              <div key={i} className={cn('flex items-center justify-between p-4 rounded-xl', theme.accentBg)}>
                <div>
                  <p className={cn('font-semibold text-text-primary', isChild ? 'text-lg' : 'text-sm')}>
                    {contact.name}
                  </p>
                  <p className="text-xs text-text-muted">{contact.role}</p>
                </div>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl font-semibold',
                    isChild ? 'text-base py-3' : 'text-sm',
                    theme.primaryButton
                  )}
                >
                  <Phone className="w-4 h-4" />
                  {isChild ? 'Call' : contact.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crisis lines */}
      <div className="bg-white rounded-2xl shadow-soft p-5">
        <h2 className={cn('font-semibold text-text-primary mb-4', isChild ? 'text-xl' : 'text-base')}>
          {isChild ? 'Help lines (free!)' : isTeen ? '24/7 support lines' : 'Crisis resources'}
        </h2>
        <div className="space-y-2">
          {(plan?.crisis_resources || AUSTRALIAN_CRISIS_RESOURCES.slice(0, 4)).map((resource, i) => (
            <a
              key={i}
              href={`tel:${resource.phone.replace(/\s/g, '')}`}
              className={cn(
                'flex items-center justify-between p-3 rounded-xl border border-beige hover:border-sage transition-colors',
                isChild ? 'p-4' : ''
              )}
            >
              <div>
                <p className={cn('font-medium text-text-primary', isChild ? 'text-base' : 'text-sm')}>
                  {resource.name}
                </p>
                <p className="text-xs text-text-muted">{resource.available}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('font-semibold', theme.primaryText, isChild ? 'text-base' : 'text-sm')}>
                  {resource.phone}
                </span>
                <Phone className={cn('w-4 h-4', theme.primaryText)} />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Coping strategies */}
      {plan?.coping_strategies && plan.coping_strategies.length > 0 && (
        <div className="bg-white rounded-2xl shadow-soft p-5">
          <h2 className={cn('font-semibold text-text-primary mb-4', isChild ? 'text-xl' : 'text-base')}>
            {isChild ? 'Things that help me' : isTeen ? 'What helps me cope' : 'Coping strategies'}
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {plan.coping_strategies.map((strategy, i) => (
              <div key={i} className={cn('flex items-center gap-3 p-3 rounded-xl', theme.accentBg)}>
                {!isChild && <span className="text-sm text-text-muted flex-shrink-0">✓</span>}
                <p className={cn('text-text-primary', isChild ? 'text-base' : 'text-sm')}>{strategy}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reasons for living — only for teen/adult */}
      {!isChild && plan?.reasons_for_living && plan.reasons_for_living.length > 0 && (
        <div className={cn('rounded-2xl p-5', theme.primaryBg)}>
          <h2 className={cn('font-semibold text-text-primary mb-3', isTeen ? 'text-base' : 'text-base')}>
            {isTeen ? 'Things that matter to me' : 'Reasons for living'}
          </h2>
          <ul className="space-y-2">
            {plan.reasons_for_living.map((reason, i) => (
              <li key={i} className={cn('flex items-start gap-2 text-text-secondary', isTeen ? 'text-base' : 'text-sm')}>
                <Heart className={cn('w-4 h-4 flex-shrink-0 mt-0.5', theme.primaryText)} />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
