import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail, Calendar, Building2, MessageSquare } from 'lucide-react';
import { formatDateTime, formatPhone, LEAD_ORIGINS, LEAD_STATUS, STATUS_COLORS } from '@/lib/formatters';

interface Lead {
  id: string;
  contact_name: string | null;
  contact_phone: string | null;
  email: string | null;
  origin: string | null;
  status: string | null;
  message: string | null;
  created_at: string | null;
  last_contact_at: string | null;
  property_id: string | null;
  properties?: {
    title: string;
  };
}

interface LeadCardProps {
  lead: Lead;
  onClick: (lead: Lead) => void;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const statusKey = lead.status as keyof typeof LEAD_STATUS || 'active';
  const originKey = lead.origin as keyof typeof LEAD_ORIGINS || 'platform';

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick(lead)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-primary" />
            {lead.contact_name || 'Sem nome'}
          </CardTitle>
          <Badge className={STATUS_COLORS[statusKey]}>
            {LEAD_STATUS[statusKey]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {lead.contact_phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            {formatPhone(lead.contact_phone)}
          </div>
        )}
        
        {lead.email && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            {lead.email}
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          Origem: {LEAD_ORIGINS[originKey]}
        </div>

        {lead.properties && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            {lead.properties.title}
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {formatDateTime(lead.created_at)}
        </div>

        {lead.message && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2 pt-2 border-t">
            {lead.message}
          </p>
        )}

        {lead.last_contact_at && (
          <p className="text-xs text-muted-foreground">
            Último contato: {formatDateTime(lead.last_contact_at)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
