import { cn } from '@/lib/utils';
import { VotingRecord } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface VotingPieChartProps {
  votingRecord: VotingRecord;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function VotingPieChart({ votingRecord, className, size = 'md' }: VotingPieChartProps) {
  const { t } = useLanguage();
  
  const total = votingRecord.votesFor.length + votingRecord.votesAgainst.length + 
                votingRecord.abstained.length + votingRecord.absent.length;
  
  const forPercent = (votingRecord.votesFor.length / total) * 100;
  const againstPercent = (votingRecord.votesAgainst.length / total) * 100;
  const abstainedPercent = (votingRecord.abstained.length / total) * 100;
  const absentPercent = (votingRecord.absent.length / total) * 100;

  // Calculate stroke dash offsets for pie chart
  const circumference = 2 * Math.PI * 45;
  const forDash = (forPercent / 100) * circumference;
  const againstDash = (againstPercent / 100) * circumference;
  const abstainedDash = (abstainedPercent / 100) * circumference;
  const absentDash = (absentPercent / 100) * circumference;

  const dimensions = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-48 h-48',
  };

  const segments = [
    { value: forDash, offset: 0, color: 'stroke-vote-for', label: t('voting.for'), count: votingRecord.votesFor.length },
    { value: againstDash, offset: forDash, color: 'stroke-vote-against', label: t('voting.against'), count: votingRecord.votesAgainst.length },
    { value: abstainedDash, offset: forDash + againstDash, color: 'stroke-vote-abstain', label: t('voting.abstained'), count: votingRecord.abstained.length },
    { value: absentDash, offset: forDash + againstDash + abstainedDash, color: 'stroke-muted', label: t('voting.absent'), count: votingRecord.absent.length },
  ];

  return (
    <div className={cn('flex items-center gap-6', className)}>
      <div className={cn('relative', dimensions[size])}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {segments.map((segment, index) => (
            <circle
              key={index}
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="10"
              className={segment.color}
              strokeDasharray={`${segment.value} ${circumference - segment.value}`}
              strokeDashoffset={-segment.offset}
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn(
            'font-bold',
            votingRecord.passed ? 'text-vote-for' : 'text-vote-against',
            size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-2xl'
          )}>
            {votingRecord.passed ? t('voting.passed') : t('voting.rejected')}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className={cn(
              'w-3 h-3 rounded-sm',
              segment.color.replace('stroke-', 'bg-')
            )} />
            <span className="text-muted-foreground">{segment.label}:</span>
            <span className="font-medium">{segment.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
