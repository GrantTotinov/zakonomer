import { useLanguage } from '@/contexts/LanguageContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { DeputyCard } from '@/components/DeputyCard';
import { LoadingList } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDeputies, usePartyStats } from '@/hooks/useParliamentData';

export default function VotingPage() {
  const { t } = useLanguage();
  
  const { data: deputies = [], isLoading: deputiesLoading, isError, refetch } = useDeputies();
  const { data: partyStats = [], isLoading: partyLoading } = usePartyStats();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold text-foreground mb-6">{t('nav.voting')}</h1>

          {/* Party Overview */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">{t('voting.partyBreakdown')}</h2>
            {partyLoading ? (
              <LoadingList count={3} />
            ) : partyStats.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {partyStats.map(({ party, deputyCount, avgConsistency, avgAttendance }) => (
                  <Card key={party.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-sm"
                          style={{ backgroundColor: party.color }}
                        />
                        <CardTitle className="text-lg">{party.shortName}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold">{deputyCount}</p>
                          <p className="text-xs text-muted-foreground">{t('stats.deputies')}</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{avgConsistency}%</p>
                          <p className="text-xs text-muted-foreground">{t('deputy.consistencyScore')}</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{avgAttendance}%</p>
                          <p className="text-xs text-muted-foreground">{t('deputy.attendance')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </section>

          {/* Deputies List */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t('voting.deputyList')}</h2>
            {isError ? (
              <ErrorState onRetry={() => refetch()} />
            ) : deputiesLoading ? (
              <LoadingList count={6} />
            ) : deputies.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deputies.map((deputy) => (
                  <DeputyCard key={deputy.id} deputy={deputy} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
