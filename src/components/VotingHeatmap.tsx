import { cn } from '@/lib/utils';
import { Deputy, VoteType } from '@/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';

interface VotingHeatmapProps {
  deputies: Deputy[];
  getVoteForDeputy: (deputyId: string) => VoteType | undefined;
  className?: string;
}

export function VotingHeatmap({ deputies, getVoteForDeputy, className }: VotingHeatmapProps) {
  const { t } = useLanguage();

  const getVoteColor = (vote: VoteType | undefined) => {
    switch (vote) {
      case 'for':
        return 'bg-vote-for';
      case 'against':
        return 'bg-vote-against';
      case 'abstained':
        return 'bg-vote-abstain';
      case 'absent':
        return 'bg-muted';
      default:
        return 'bg-muted/50';
    }
  };

  const getVoteLabel = (vote: VoteType | undefined) => {
    switch (vote) {
      case 'for':
        return t('voting.for');
      case 'against':
        return t('voting.against');
      case 'abstained':
        return t('voting.abstained');
      case 'absent':
        return t('voting.absent');
      default:
        return '-';
    }
  };

  // Group deputies by party
  const deputiesByParty = deputies.reduce((acc, deputy) => {
    const partyId = deputy.party.id;
    if (!acc[partyId]) {
      acc[partyId] = { party: deputy.party, deputies: [] };
    }
    acc[partyId].deputies.push(deputy);
    return acc;
  }, {} as Record<string, { party: typeof deputies[0]['party']; deputies: Deputy[] }>);

  return (
    <div className={cn('space-y-4', className)}>
      {Object.values(deputiesByParty).map(({ party, deputies: partyDeputies }) => (
        <div key={party.id} className="space-y-2">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: party.color }}
            />
            <span className="text-sm font-medium">{party.shortName}</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {partyDeputies.map((deputy) => {
              const vote = getVoteForDeputy(deputy.id);
              return (
                <Tooltip key={deputy.id}>
                  <TooltipTrigger asChild>
                    <button
                      className={cn(
                        'w-8 h-8 rounded-sm transition-all hover:scale-110 cursor-pointer',
                        getVoteColor(vote)
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <p className="font-medium">{deputy.name}</p>
                      <p className="text-muted-foreground">{getVoteLabel(vote)}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
