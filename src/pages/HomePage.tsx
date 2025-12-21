import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { StatsCard } from '@/components/StatsCard';
import { LawCard } from '@/components/LawCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { laws, recentChanges, controversialVotes, deputies } from '@/data/mockData';
import { Scale, Vote, Users, TrendingUp, Search, ArrowRight, Flame } from 'lucide-react';
import { format } from 'date-fns';
import { bg, enUS } from 'date-fns/locale';

export default function HomePage() {
  const { t, language } = useLanguage();
  const locale = language === 'bg' ? bg : enUS;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 lg:py-28">
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">
                {language === 'bg' ? 'Прозрачност в законодателството' : 'Transparency in legislation'}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                {t('hero.title')}
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder={t('hero.searchPlaceholder')}
                    className="pl-10 h-12"
                  />
                </div>
                <Button size="lg" asChild>
                  <Link to="/laws">
                    {t('hero.cta')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 border-b border-border">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard 
                title={t('stats.totalLaws')} 
                value={laws.length} 
                icon={<Scale className="h-6 w-6" />} 
              />
              <StatsCard 
                title={t('stats.changesThisMonth')} 
                value={12} 
                icon={<TrendingUp className="h-6 w-6" />}
                trend={{ value: 15, isPositive: true }}
              />
              <StatsCard 
                title={t('stats.deputies')} 
                value={deputies.length} 
                icon={<Users className="h-6 w-6" />} 
              />
              <StatsCard 
                title={t('stats.votes')} 
                value={156} 
                icon={<Vote className="h-6 w-6" />} 
              />
            </div>
          </div>
        </section>

        {/* Recent Changes */}
        <section className="py-12">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">{t('recent.title')}</h2>
              <Button variant="ghost" asChild>
                <Link to="/laws">{t('recent.viewAll')} <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {laws.slice(0, 3).map((law) => (
                <LawCard key={law.id} law={law} />
              ))}
            </div>
          </div>
        </section>

        {/* Hot Debates */}
        <section className="py-12 bg-muted/50">
          <div className="container">
            <div className="flex items-center gap-2 mb-6">
              <Flame className="h-6 w-6 text-destructive" />
              <h2 className="text-2xl font-bold text-foreground">{t('debates.title')}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {controversialVotes.map((vote) => (
                <Card key={vote.voteId} className="hover:shadow-lg transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">
                        {t('debates.controversial')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(vote.date), 'dd MMM yyyy', { locale })}
                      </span>
                    </div>
                    <CardTitle className="text-lg">
                      <Link to={`/laws/${vote.lawId}`} className="hover:text-primary transition-colors">
                        {vote.lawTitle}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-vote-for font-medium">{t('voting.for')}: {vote.votesFor}</span>
                          <span className="text-vote-against font-medium">{t('voting.against')}: {vote.votesAgainst}</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden bg-vote-against flex">
                          <div 
                            className="h-full bg-vote-for transition-all"
                            style={{ width: `${(vote.votesFor / (vote.votesFor + vote.votesAgainst)) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
