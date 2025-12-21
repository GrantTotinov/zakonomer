import { useLanguage } from '@/contexts/LanguageContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { DeputyCard } from '@/components/DeputyCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { laws, deputies, parties } from '@/data/mockData';
import { VoteType } from '@/types';

export default function VotingPage() {
  const { t } = useLanguage();

  // Calculate party voting patterns
  const partyStats = parties.map(party => {
    const partyDeputies = deputies.filter(d => d.party.id === party.id);
    return {
      party,
      deputyCount: partyDeputies.length,
      avgConsistency: Math.round(partyDeputies.reduce((sum, d) => sum + d.consistencyScore, 0) / partyDeputies.length),
      avgAttendance: Math.round(partyDeputies.reduce((sum, d) => sum + d.attendance, 0) / partyDeputies.length),
    };
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold text-foreground mb-6">{t('nav.voting')}</h1>

          {/* Party Overview */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">{t('voting.partyBreakdown')}</h2>
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
          </section>

          {/* Recent Votes */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t('voting.deputyList')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deputies.map((deputy) => (
                <DeputyCard key={deputy.id} deputy={deputy} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
