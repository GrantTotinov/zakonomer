import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { LawCard } from '@/components/LawCard';
import { LoadingList } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useBills, useSearchBills } from '@/hooks/useParliamentData';
import { Search } from 'lucide-react';

const categories = ['all', 'tax', 'labor', 'criminal', 'administrative', 'environmental', 'civil'];

export default function LawsPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: allLaws = [], isLoading, isError, refetch } = useBills();
  const { data: searchResults = [], isLoading: searchLoading } = useSearchBills(searchQuery);

  // Use search results if query is present, otherwise filter from all laws
  const laws = searchQuery.length >= 2 ? searchResults : allLaws;
  
  const filteredLaws = laws.filter(law => {
    if (searchQuery.length >= 2) return true; // Already filtered by search
    const matchesSearch = law.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          law.shortTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || law.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const loading = isLoading || (searchQuery.length >= 2 && searchLoading);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold text-foreground mb-6">{t('nav.laws')}</h1>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder={t('hero.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? t('filter.all') : t(`category.${category}` as any)}
              </Button>
            ))}
          </div>

          {/* Laws Grid */}
          {isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : loading ? (
            <LoadingList count={6} />
          ) : filteredLaws.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLaws.map((law) => (
                <LawCard key={law.id} law={law} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
