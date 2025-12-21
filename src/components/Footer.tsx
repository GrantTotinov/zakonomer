import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Scale } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Scale className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-bold text-primary">Закони.bg</span>
              <p className="text-xs text-muted-foreground">{t('footer.tagline')}</p>
            </div>
          </div>

          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground transition-colors">
              {t('footer.about')}
            </Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">
              {t('footer.contact')}
            </Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              {t('footer.terms')}
            </Link>
          </nav>
        </div>

        <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Закони.bg. Git за Закони.
        </div>
      </div>
    </footer>
  );
}
