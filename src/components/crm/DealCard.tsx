import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, User, Calendar, TrendingUp } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/formatters';

interface Deal {
  id: string;
  title: string;
  value: number | null;
  probability: number | null;
  expected_close_date: string | null;
  status: string | null;
  lead_id: string | null;
  property_id: string | null;
  leads?: {
    contact_name: string | null;
  };
  properties?: {
    title: string;
  };
}

interface DealCardProps {
  deal: Deal;
  onClick: (deal: Deal) => void;
}

export function DealCard({ deal, onClick }: DealCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow p-3"
      onClick={() => onClick(deal)}
    >
      <CardContent className="p-0 space-y-2">
        <h4 className="font-semibold text-sm line-clamp-2">{deal.title}</h4>
        
        {deal.value && (
          <p className="text-lg font-bold text-primary">
            {formatCurrency(deal.value)}
          </p>
        )}

        {deal.leads?.contact_name && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            {deal.leads.contact_name}
          </div>
        )}

        {deal.properties?.title && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Building2 className="h-3 w-3" />
            <span className="line-clamp-1">{deal.properties.title}</span>
          </div>
        )}

        {deal.expected_close_date && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDate(deal.expected_close_date)}
          </div>
        )}

        {deal.probability !== null && (
          <div className="flex items-center gap-1 text-xs">
            <TrendingUp className="h-3 w-3" />
            <Badge variant="outline" className="text-xs">
              {deal.probability}% chance
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
