import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Deputy } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User, MapPin } from 'lucide-react';

interface DeputyCardProps {
  deputy: Deputy;
  className?: string;
}

export function DeputyCard({ deputy, className }: DeputyCardProps) {
  const { t } = useLanguage();

  const getConsistencyColor = () => {
    if (deputy.consistencyScore >= 90) return 'text-trust-high';
    if (deputy.consistencyScore >= 70) return 'text-trust-medium';
    return 'text-trust-low';
  };

  return (
    <Link to={`/deputies/${deputy.id}`}>
      <Card className={cn(
        'group transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer',
        className
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center shrink-0">
              {deputy.photo ? (
                <img src={deputy.photo} alt={deputy.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="h-7 w-7 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {deputy.name}
              </h3>
              
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{ 
                    borderColor: deputy.party.color,
                    color: deputy.party.color,
                    backgroundColor: `${deputy.party.color}10`
                  }}
                >
                  {deputy.party.shortName}
                </Badge>
                
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {deputy.constituency}
                </span>
              </div>

              {/* Stats */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t('deputy.consistencyScore')}</span>
                  <span className={cn('font-medium', getConsistencyColor())}>
                    {deputy.consistencyScore}%
                  </span>
                </div>
                <Progress value={deputy.consistencyScore} className="h-1.5" />
                
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-muted-foreground">{t('deputy.attendance')}</span>
                  <span className="font-medium">{deputy.attendance}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
