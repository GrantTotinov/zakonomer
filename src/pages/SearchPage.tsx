import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { LawCard } from '@/components/LawCard';
import { DeputyCard } from '@/components/DeputyCard';
import { LoadingList } from '@/components/LoadingState';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchBills, useDeputies } from '@/hooks/useParliamentData';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  const { data: lawResults = [], isLoading: lawsLoading } = useSearchBills(query);
  const { data: allDeputies = [], isLoading: deputiesLoading } = useDeputies();

  // Filter deputies locally
  const deputyResults = query.length >= 2 
    ? allDeputies.filter(d => 
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.party.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const isLoading = lawsLoading || deputiesLoading;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold text-foreground mb-6">{t('nav.search')}</h1>

          {/* Search Input */}
          <div className="relative max-w-2xl mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder={t('hero.searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          {query.length >= 2 && (
            <Tabs defaultValue="laws">
              <TabsList className="mb-6">
                <TabsTrigger value="laws">
                  {t('search.laws')} ({lawResults.length})
                </TabsTrigger>
                <TabsTrigger value="deputies">
                  {t('search.deputies')} ({deputyResults.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="laws">
                {lawsLoading ? (
                  <LoadingList count={6} />
                ) : lawResults.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lawResults.map((law) => (
                      <LawCard key={law.id} law={law} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-12">{t('search.noResults')}</p>
                )}
              </TabsContent>

              <TabsContent value="deputies">
                {deputiesLoading ? (
                  <LoadingList count={6} />
                ) : deputyResults.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {deputyResults.map((deputy) => (
                      <DeputyCard key={deputy.id} deputy={deputy} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-12">{t('search.noResults')}</p>
                )}
              </TabsContent>
            </Tabs>
          )}

          {query.length < 2 && (
            <p className="text-muted-foreground text-center py-12">
              {t('hero.searchPlaceholder')}
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
