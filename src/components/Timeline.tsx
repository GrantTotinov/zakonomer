import { cn } from '@/lib/utils';
import { Version } from '@/types';
import { format } from 'date-fns';
import { bg, enUS } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';

interface TimelineProps {
  versions: Version[];
  selectedVersion: string;
  onSelectVersion: (versionId: string) => void;
  className?: string;
}

export function Timeline({ versions, selectedVersion, onSelectVersion, className }: TimelineProps) {
  const { language } = useLanguage();
  const locale = language === 'bg' ? bg : enUS;

  return (
    <div className={cn('relative', className)}>
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
      
      <div className="space-y-6">
        {versions.map((version, index) => {
          const isSelected = version.id === selectedVersion;
          const isLatest = index === 0;
          
          return (
            <button
              key={version.id}
              onClick={() => onSelectVersion(version.id)}
              className={cn(
                'relative flex items-start gap-4 w-full text-left group transition-all pl-0',
                isSelected && 'scale-[1.02]'
              )}
            >
              {/* Timeline marker */}
              <div
                className={cn(
                  'relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all',
                  isSelected
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                    : 'bg-muted text-muted-foreground group-hover:bg-primary/20'
                )}
              >
                <span className="text-xs font-bold">
                  {version.versionNumber.replace('v', '')}
                </span>
              </div>

              {/* Content */}
              <div
                className={cn(
                  'flex-1 rounded-lg border p-4 transition-all',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card group-hover:border-primary/50'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">
                    {format(new Date(version.date), 'dd MMM yyyy', { locale })}
                  </span>
                  {isLatest && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                      {language === 'bg' ? 'Текуща' : 'Current'}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {version.summary}
                </p>
                
                {/* Change counts */}
                <div className="flex items-center gap-3 text-xs">
                  {version.changesCount.added > 0 && (
                    <span className="flex items-center gap-1 text-diff-added">
                      <span className="font-medium">+{version.changesCount.added}</span>
                    </span>
                  )}
                  {version.changesCount.removed > 0 && (
                    <span className="flex items-center gap-1 text-diff-removed">
                      <span className="font-medium">-{version.changesCount.removed}</span>
                    </span>
                  )}
                  {version.changesCount.modified > 0 && (
                    <span className="flex items-center gap-1 text-diff-modified">
                      <span className="font-medium">~{version.changesCount.modified}</span>
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
