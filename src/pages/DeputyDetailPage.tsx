import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getDeputyById, laws } from '@/data/mockData';
import { ArrowLeft, User, MapPin, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DeputyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  
  const deputy = getDeputyById(id || '');

  if (!deputy) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">{t('general.noResults')}</p>
        </main>
        <Footer />
      </div>
    );
  }

  const getConsistencyColor = () => {
    if (deputy.consistencyScore >= 90) return 'text-trust-high';
    if (deputy.consistencyScore >= 70) return 'text-trust-medium';
    return 'text-trust-low';
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/voting">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('general.back')}
            </Link>
          </Button>

          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>

                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground">{deputy.name}</h1>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <Badge 
                      style={{ 
                        borderColor: deputy.party.color,
                        color: deputy.party.color,
                        backgroundColor: `${deputy.party.color}10`
                      }}
                    >
                      {deputy.party.name}
                    </Badge>
                    
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {deputy.constituency}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{t('deputy.consistencyScore')}</p>
                      <p className={cn('text-3xl font-bold', getConsistencyColor())}>
                        {deputy.consistencyScore}%
                      </p>
                      <Progress value={deputy.consistencyScore} className="h-2 mt-2" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{t('deputy.attendance')}</p>
                      <p className="text-3xl font-bold">{deputy.attendance}%</p>
                      <Progress value={deputy.attendance} className="h-2 mt-2" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{t('deputy.votesWithParty')}</p>
                      <p className="text-3xl font-bold">87%</p>
                      <Progress value={87} className="h-2 mt-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voting History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {t('deputy.votingHistory')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {laws.slice(0, 5).map((law) => (
                  <div key={law.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <Link to={`/laws/${law.id}`} className="font-medium hover:text-primary transition-colors">
                        {law.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">{law.lastUpdated}</p>
                    </div>
                    <Badge variant="outline" className="bg-vote-for/10 text-vote-for border-vote-for/20">
                      {t('voting.for')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
