'use client';

import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useDemoData } from '@/hooks/useDemoData';
import { formatDate } from '@/lib/utils';
import { Plus, Shield, AlertTriangle, Clock, Eye, Edit, Phone } from 'lucide-react';

const safetyPlans = [
  { id: 1, client: 'Sophie Williams', client_id: 'client-3', risk_level: 'high', last_reviewed: new Date(Date.now() - 604800000).toISOString(), status: 'active' },
  { id: 2, client: 'Emma Thompson', client_id: 'client-1', risk_level: 'moderate', last_reviewed: new Date(Date.now() - 1209600000).toISOString(), status: 'active' },
  { id: 3, client: 'Mia Patel', client_id: 'client-5', risk_level: 'moderate', last_reviewed: new Date(Date.now() - 2419200000).toISOString(), status: 'review_due' },
];

const crisisResources = [
  { name: 'Lifeline', phone: '13 11 14', available: '24/7' },
  { name: 'Beyond Blue', phone: '1300 22 4636', available: '24/7' },
  { name: 'Kids Helpline', phone: '1800 55 1800', available: '24/7' },
  { name: 'Butterfly Foundation', phone: '1800 33 4673', available: '8am-midnight' },
  { name: '000 Emergency', phone: '000', available: '24/7' },
];

export default function SafetyPlansPage() {
  const { clients } = useDemoData();

  return (
    <div className="min-h-screen">
      <Header
        title="Safety Plans"
        subtitle="Client crisis management and safety planning"
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />}>
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
                <div className="space-y-4">
                  {safetyPlans.map((plan) => (
                    <div key={plan.id} className="p-4 border border-beige rounded-xl hover:bg-sand/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Avatar firstName={plan.client.split(' ')[0]} lastName={plan.client.split(' ')[1]} size="lg" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-text-primary">{plan.client}</h3>
                            <Badge variant={plan.risk_level === 'high' ? 'error' : 'warning'}>
                              {plan.risk_level === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
                              {plan.risk_level} risk
                            </Badge>
                            {plan.status === 'review_due' && (
                              <Badge variant="warning">
                                <Clock className="w-3 h-3 mr-1" />
                                Review Due
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-text-muted">
                            Last reviewed: {formatDate(plan.last_reviewed)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                            View
                          </Button>
                          <Button variant="secondary" size="sm" leftIcon={<Edit className="w-4 h-4" />}>
                            Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                {crisisResources.map((resource, i) => (
                  <div key={i} className="p-3 bg-sand rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-text-primary">{resource.name}</p>
                      <Badge variant="default" size="sm">{resource.available}</Badge>
                    </div>
                    <a href={`tel:${resource.phone.replace(/\s/g, '')}`} className="text-calm hover:text-calm-dark font-mono">
                      {resource.phone}
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
