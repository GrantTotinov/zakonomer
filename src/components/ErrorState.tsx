import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ message, onRetry, className = '' }: ErrorStateProps) {
  const { t } = useLanguage();
  
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">{t('general.error')}</h3>
      <p className="text-muted-foreground text-center max-w-md mb-4">
        {message || t('general.errorMessage')}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('general.retry')}
        </Button>
      )}
    </div>
  );
}
