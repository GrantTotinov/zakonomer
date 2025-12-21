import { FileQuestion } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, message, icon, className = '' }: EmptyStateProps) {
  const { t } = useLanguage();
  
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      {icon || <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />}
      <h3 className="text-lg font-semibold mb-2">{title || t('general.noResults')}</h3>
      <p className="text-muted-foreground text-center max-w-md">
        {message || t('general.noResultsMessage')}
      </p>
    </div>
  );
}
