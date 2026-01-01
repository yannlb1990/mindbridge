'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { useDemoData } from '@/hooks/useDemoData';
import { calculateAge, getRiskLevelColor } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  UserPlus,
} from 'lucide-react';

export default function ClientsPage() {
  const { clients } = useDemoData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('active');

  const filteredClients = clients.filter((client) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      client.first_name.toLowerCase().includes(searchLower) ||
      client.last_name.toLowerCase().includes(searchLower) ||
      client.primary_diagnosis?.toLowerCase().includes(searchLower);

    // Risk filter
    const matchesRisk = filterRisk === 'all' || client.current_risk_level === filterRisk;

    // Status filter
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;

    return matchesSearch && matchesRisk && matchesStatus;
  });

  return (
    <div className="min-h-screen">
      <Header
        title="Clients"
        subtitle={`${clients.filter((c) => c.status === 'active').length} active clients`}
        actions={
          <Button leftIcon={<UserPlus className="w-4 h-4" />}>
            Add Client
          </Button>
        }
      />

      <div className="p-6">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search by name or diagnosis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-beige rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
                />
              </div>

              {/* Risk Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-text-muted" />
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  className="px-4 py-2.5 border border-beige rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-sage"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="moderate">Moderate Risk</option>
                  <option value="high">High Risk</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border border-beige rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-sage"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="discharged">Discharged</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Client List */}
        <div className="space-y-3">
          {filteredClients.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <UserPlus className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">No clients found</h3>
                <p className="text-text-secondary mb-4">
                  {searchQuery ? 'Try adjusting your search or filters' : 'Add your first client to get started'}
                </p>
                <Button leftIcon={<Plus className="w-4 h-4" />}>
                  Add Client
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredClients.map((client) => (
              <Link key={client.id} href={`/clients/${client.id}`}>
                <Card className="hover:shadow-medium transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <Avatar
                        firstName={client.first_name}
                        lastName={client.last_name}
                        size="lg"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-text-primary">
                            {client.first_name} {client.last_name}
                          </h3>
                          <Badge
                            variant={
                              client.current_risk_level === 'low'
                                ? 'success'
                                : client.current_risk_level === 'moderate'
                                ? 'warning'
                                : 'error'
                            }
                            size="sm"
                          >
                            {client.current_risk_level === 'high' || client.current_risk_level === 'critical' ? (
                              <AlertTriangle className="w-3 h-3 mr-1" />
                            ) : null}
                            {client.current_risk_level}
                          </Badge>
                          <Badge variant="default" size="sm">
                            {client.status}
                          </Badge>
                        </div>

                        <p className="text-sm text-text-secondary mb-2">
                          {client.date_of_birth ? `${calculateAge(client.date_of_birth)} years old` : ''}
                          {client.primary_diagnosis && ` • ${client.primary_diagnosis}`}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {client.session_count} sessions
                          </span>
                          <span>{client.treatment_approach}</span>
                        </div>
                      </div>

                      {/* Action */}
                      <ChevronRight className="w-5 h-5 text-text-muted" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
