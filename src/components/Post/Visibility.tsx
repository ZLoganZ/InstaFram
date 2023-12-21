import { useMemo } from 'react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { IVisibility } from '@/types';

interface IVisibilityProps {
  className?: string;
  visibility: IVisibility;
}

const Visibility = ({ visibility, className }: IVisibilityProps) => {
  const svgUrl = useMemo(() => {
    switch (visibility) {
      case 'Public':
        return '/assets/icons/public.svg';
      case 'Private':
        return '/assets/icons/private.svg';
      case 'Followers':
        return '/assets/icons/followers.svg';
    }
  }, [visibility]);

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <img className={cn('w-4 h-4 dark:invert-white', className)} src={svgUrl} alt={visibility} />
        </TooltipTrigger>
        <TooltipContent>
          <p className='small-regular'>{visibility}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Visibility;
