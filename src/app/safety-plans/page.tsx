'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useSafetyPlans, SafetyPlan, AUSTRALIAN_CRISIS_RESOURCES } from '@/hooks/useSafetyPlans';
import { SafetyPlanEditor } from '@/components/safety/SafetyPlanEditor';
import { formatDate } from '@/lib/utils';
import { Plus, Shield, AlertTriangle, Clock, Eye, Edit, Phone, Loader2 } from 'lucide-react';

export default function SafetyPlansPage() {
  const { safetyPlans, isLoading } = useSafetyPlans();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SafetyPlan | undefined>();

  const handleViewPlan = (plan: SafetyPlan) => {
    setSelectedPlan(plan);
    setIsEditorOpen(true);
  };

  const handleNewPlan = () => {
    setSelectedPlan(undefined);
    setIsEditorOpen(true);
  };

  const isReviewDue = (plan: SafetyPlan) => {
    if (!plan.next_review_date) return false;
    return new Date(plan.next_review_date) <= new Date();
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Safety Plans"
        subtitle="Client crisis management and safety planning"
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={handleNewPlan}>
            Create Safety Plan
          </Button>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Safety Plans List */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-sage" />
                  Active Safety Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-sage" />
                  </div>
                )}

                {!isLoading && safetyPlans.length === 0 && (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-text-primary mb-2">No safety plans</h3>
                    <p className="text-text-secondary mb-4">
                      Create a safety plan for clients who need additional support
                    </p>
                    <Button leftIcon={<Plus className="w-4 h-4" />} onClick={handleNewPlan}>
                      Create Safety Plan
                    </Button>
                  </div>
                )}

                {!isLoading && safetyPlans.length > 0 && (
                  <div className="space-y-4">
                    {safetyPlans.map((plan) => (
                      <div key={plan.id} className="p-4 border border-beige rounded-xl hover:bg-sand/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <Avatar
                            firstName={(plan.client_name || 'Unknown').split(' ')[0]}
                            lastName={(plan.client_name || 'Client').split(' ')[1] || ''}
                            size="lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-semibold text-text-primary">
                                {plan.client_name || 'Unknown Client'}
                              </h3>
                              {plan.warning_signs.length > 0 && (
                                <Badge variant="error">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  {plan.warning_signs.length} warning signs
                                </Badge>
                              )}
                              {isReviewDue(plan) && (
                                <Badge variant="warning">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Review Due
                                </Badge>
                              )}
                              {plan.is_active && (
                                <Badge variant="success">Active</Badge>
                              )}
                            </div>
                            <p className="text-sm text-text-muted">
                              Last reviewed: {formatDate(plan.last_reviewed)}
                              {plan.next_review_date && (
                                <> · Next review: {formatDate(plan.next_review_date)}</>
                              )}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {plan.coping_strategies.slice(0, 3).map((strategy, i) => (
                                <span key={i} className="px-2 py-0.5 text-xs bg-sage-light/20 text-sage-dark rounded-full">
                                  {strategy}
                                </span>
                              ))}
                              {plan.coping_strategies.length > 3 && (
                                <span className="px-2 py-0.5 text-xs bg-beige text-text-muted rounded-full">
                                  +{plan.coping_strategies.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              leftIcon={<Eye className="w-4 h-4" />}
                              onClick={() => handleViewPlan(plan)}
                            >
                              View
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              leftIcon={<Edit className="w-4 h-4" />}
                              onClick={() => handleViewPlan(plan)}
                            >
                              Review
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Crisis Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-coral" />
                Crisis Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-muted mb-4">
                Australian crisis helplines included in all safety plans
              </p>
              <div className="space-y-3">
                {AUSTRALIAN_CRISIS_RESOURCES.map((resource, i) => (
                  <div key={i} className="p-3 bg-sand rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-text-primary">{resource.name}</p>
                      <Badge variant="default" size="sm">{resource.available}</Badge>
                    </div>
                    <a
                      href={`tel:${resource.phone.replace(/\s/g, '')}`}
                      className="text-calm hover:text-calm-dark font-mono"
                    >
                      {resource.phone}
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Safety Plan Editor */}
      <SafetyPlanEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedPlan(undefined);
        }}
        existingPlan={selectedPlan}
        onSuccess={() => {
          // Plans will auto-refresh via the hook
        }}
      />
    </div>
  );
}
