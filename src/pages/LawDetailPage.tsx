import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Timeline } from '@/components/Timeline';
import { DiffViewer } from '@/components/DiffViewer';
import { VotingPieChart } from '@/components/VotingPieChart';
import { VotingHeatmap } from '@/components/VotingHeatmap';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBill, useDeputies } from '@/hooks/useParliamentData';
import { Bell, BellOff, Share2, ArrowLeft, GitBranch, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import { bg, enUS } from 'date-fns/locale';

export default function LawDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const locale = language === 'bg' ? bg : enUS;
  
  const { data: law, isLoading, isError, refetch } = useBill(id || '');
  const { data: deputies = [] } = useDeputies();
  
  const [selectedVersion, setSelectedVersion] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showDiff, setShowDiff] = useState(true);

  // Set initial version when law loads
  if (law && !selectedVersion && law.versions.length > 0) {
    setSelectedVersion(law.versions[0].id);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1">
          <LoadingState />
        </main>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <ErrorState onRetry={() => refetch()} />
        </main>
        <Footer />
      </div>
    );
  }

  if (!law) {
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

  const currentVersionData = law.versions.find(v => v.id === selectedVersion) || law.versions[0];
  const votingRecord = currentVersionData?.votingRecord;

  const getVoteForDeputy = (deputyId: string) => {
    if (!votingRecord) return undefined;
    if (votingRecord.votesFor.find(v => v.deputyId === deputyId)) return 'for' as const;
    if (votingRecord.votesAgainst.find(v => v.deputyId === deputyId)) return 'against' as const;
    if (votingRecord.abstained.find(v => v.deputyId === deputyId)) return 'abstained' as const;
    return 'absent' as const;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 py-8">
        <div className="container">
          {/* Back button */}
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/laws">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('general.back')}
            </Link>
          </Button>

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {law.shortTitle && (
                  <Badge variant="secondary">{law.shortTitle}</Badge>
                )}
                <Badge variant="outline">{t(`filter.${law.status}` as any)}</Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{law.title}</h1>
              <p className="text-muted-foreground mt-2">
                {t('general.lastUpdated')}: {format(new Date(law.lastUpdated), 'dd MMM yyyy', { locale })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isFollowing ? 'default' : 'outline'}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? <BellOff className="mr-2 h-4 w-4" /> : <Bell className="mr-2 h-4 w-4" />}
                {isFollowing ? t('law.following') : t('law.follow')}
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Version Tabs */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5" />
                    {t('law.versions')}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDiff(!showDiff)}
                  >
                    {showDiff ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                    {showDiff ? t('law.hideDiff') : t('law.viewDiff')}
                  </Button>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectedVersion} onValueChange={setSelectedVersion}>
                    <TabsList className="mb-4">
                      {law.versions.map((version) => (
                        <TabsTrigger key={version.id} value={version.id}>
                          {version.versionNumber}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {law.versions.map((version) => (
                      <TabsContent key={version.id} value={version.id}>
                        <div className="space-y-4">
                          <div className="p-4 rounded-lg bg-muted/50">
                            <p className="font-medium">{version.summary}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {t('law.effectiveFrom')}: {format(new Date(version.effectiveDate), 'dd MMM yyyy', { locale })}
                            </p>
                          </div>

                          {showDiff && version.changes.map((articleChange) => (
                            <div key={articleChange.articleNumber} className="space-y-2">
                              <h4 className="font-semibold">
                                {t('law.article')} {articleChange.articleNumber}: {articleChange.title}
                              </h4>
                              <DiffViewer changes={articleChange.changes} />
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>

              {/* Voting Record */}
              {votingRecord && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('law.votingRecord')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <VotingPieChart votingRecord={votingRecord} size="md" />
                    <VotingHeatmap deputies={deputies} getVoteForDeputy={getVoteForDeputy} />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar - Timeline */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>{t('law.timeline')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Timeline
                    versions={law.versions}
                    selectedVersion={selectedVersion}
                    onSelectVersion={setSelectedVersion}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
