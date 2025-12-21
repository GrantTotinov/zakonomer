import { cn } from '@/lib/utils';
import { DiffLine } from '@/types';
import { Plus, Minus, RefreshCw } from 'lucide-react';

interface DiffViewerProps {
  changes: DiffLine[];
  className?: string;
}

export function DiffViewer({ changes, className }: DiffViewerProps) {
  const getLineStyles = (type: DiffLine['type']) => {
    switch (type) {
      case 'added':
        return 'bg-diff-added-bg border-l-4 border-diff-added';
      case 'removed':
        return 'bg-diff-removed-bg border-l-4 border-diff-removed';
      case 'modified':
        return 'bg-diff-modified-bg border-l-4 border-diff-modified';
      default:
        return 'border-l-4 border-transparent';
    }
  };

  const getIcon = (type: DiffLine['type']) => {
    switch (type) {
      case 'added':
        return <Plus className="h-4 w-4 text-diff-added" />;
      case 'removed':
        return <Minus className="h-4 w-4 text-diff-removed" />;
      case 'modified':
        return <RefreshCw className="h-4 w-4 text-diff-modified" />;
      default:
        return <span className="w-4" />;
    }
  };

  return (
    <div className={cn('rounded-lg border border-border overflow-hidden font-mono text-sm', className)}>
      {changes.map((line, index) => (
        <div
          key={index}
          className={cn(
            'flex items-start gap-3 px-4 py-2 transition-colors',
            getLineStyles(line.type)
          )}
        >
          <span className="text-muted-foreground text-xs w-8 shrink-0 pt-0.5">
            {line.lineNumber}
          </span>
          <span className="shrink-0 pt-0.5">
            {getIcon(line.type)}
          </span>
          <div className="flex-1 min-w-0">
            {line.type === 'modified' && line.oldContent && (
              <div className="line-through text-diff-removed opacity-60 mb-1">
                {line.oldContent}
              </div>
            )}
            <div className={cn(
              line.type === 'removed' && 'line-through opacity-60'
            )}>
              {line.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
