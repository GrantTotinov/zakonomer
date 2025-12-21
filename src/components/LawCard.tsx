import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Law } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, GitBranch } from 'lucide-react';
import { format } from 'date-fns';
import { bg, enUS } from 'date-fns/locale';

interface LawCardProps {
  law: Law;
  className?: string;
}

export function LawCard({ law, className }: LawCardProps) {
  const { t, language } = useLanguage();
  const locale = language === 'bg' ? bg : enUS;

  const currentVersion = law.versions.find(v => v.id === law.currentVersion) || law.versions[0];
  
  const getCategoryLabel = () => {
    const key = `category.${law.category}` as any;
    return t(key);
  };

  const getStatusColor = () => {
    switch (law.status) {
      case 'active':
        return 'bg-vote-for/10 text-vote-for border-vote-for/20';
      case 'amended':
        return 'bg-diff-modified/10 text-diff-modified border-diff-modified/20';
      case 'repealed':
        return 'bg-vote-against/10 text-vote-against border-vote-against/20';
    }
  };

  return (
    <Link to={`/laws/${law.id}`}>
      <Card className={cn(
        'group transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer',
        className
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
              {law.title}
            </CardTitle>
            {law.shortTitle && (
              <Badge variant="secondary" className="shrink-0">
                {law.shortTitle}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className={cn('text-xs', getStatusColor())}>
              {t(`filter.${law.status}` as any)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {getCategoryLabel()}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {currentVersion?.summary}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(law.lastUpdated), 'dd MMM yyyy', { locale })}
              </span>
              <span className="flex items-center gap-1">
                <GitBranch className="h-3 w-3" />
                {law.versions.length} {language === 'bg' ? 'версии' : 'versions'}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {law.followers.toLocaleString()}
            </span>
          </div>

          {/* Mini change indicators */}
          {currentVersion && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
              {currentVersion.changesCount.added > 0 && (
                <span className="text-xs text-diff-added font-medium">
                  +{currentVersion.changesCount.added}
                </span>
              )}
              {currentVersion.changesCount.removed > 0 && (
                <span className="text-xs text-diff-removed font-medium">
                  -{currentVersion.changesCount.removed}
                </span>
              )}
              {currentVersion.changesCount.modified > 0 && (
                <span className="text-xs text-diff-modified font-medium">
                  ~{currentVersion.changesCount.modified}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
