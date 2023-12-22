import { Link } from '@tanstack/react-router';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogTrigger
} from '@/components/ui/dialog';
import HoverUser from '@/components/Post/HoverUser';
import { capitalizeFirstLetter, cn, getImageURL } from '@/lib/utils';
import { IUser } from '@/types';

interface IStatNumber {
  data: IUser[];
  type: 'like' | 'comment';
  dataCount: number;
  textWhite?: boolean;
}

const StatNumber = ({ data, textWhite, dataCount, type }: IStatNumber) => {
  return (
    <Dialog modal>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <p
                className={cn(
                  'small-medium lg:base:medium cursor-pointer hover:underline line-clamp-1',
                  textWhite && 'text-white'
                )}>
                {dataCount}
              </p>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <ul className='flex flex-col gap-2'>
              {data.length === 0 ? (
                <li className='flex items-center'>
                  <p className='small-regular'>No one has {type}d this post yet</p>
                </li>
              ) : (
                data.slice(0, 10).map((like) => (
                  <li key={like._id}>
                    <Link
                      to='/profile/$profileID'
                      params={{ profileID: like.alias || like._id }}
                      className='flex items-center gap-2.5 group'>
                      <img
                        src={getImageURL(like.image, 'miniAvatar') || '/assets/icons/profile-placeholder.svg'}
                        alt='avatar'
                        className='w-8 h-8 rounded-full'
                      />
                      <p className='small-regular group-hover:underline line-clamp-1'>{like.name}</p>
                    </Link>
                  </li>
                ))
              )}
              {data.length > 10 && (
                <li className='flex items-center'>
                  <p className='small-regular'>and {data.length - 10} more...</p>
                </li>
              )}
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className='max-w-md'>
        <DialogHeader className='flex justify-start w-full'>
          <DialogTitle className='flex-start gap-3'>
            <img src={`/assets/icons/${type}.svg`} alt={type} className='w-9 h-9' />
            <p className='h3-bold md:h2-bold text-left w-full'>{capitalizeFirstLetter(type)}s</p>
          </DialogTitle>
          <DialogDescription>
            {data.length === 0
              ? `No one has ${type}d this post yet`
              : data.length === 1
              ? `1 person ${type}s this post`
              : `${data.length} people ${type} this post`}
          </DialogDescription>
        </DialogHeader>
        <ul className='flex flex-col gap-5 max-h-[40rem] custom-scrollbar overflow-auto'>
          {data.length !== 0 &&
            data.map((like) => (
              <li key={like._id}>
                <HoverUser userID={like._id} showFollowButton>
                  <Link
                    to='/profile/$profileID'
                    params={{ profileID: like.alias || like._id }}
                    className='flex items-center gap-4'>
                    <img
                      src={getImageURL(like.image, 'miniAvatar') || '/assets/icons/profile-placeholder.svg'}
                      alt='avatar'
                      className='w-12 h-12 rounded-full'
                    />
                    <div className='flex flex-col'>
                      <p className='base-regular hover:underline line-clamp-1'>{like.name}</p>
                      <p className='small-regular text-[#7878A3]'>@{like.alias}</p>
                    </div>
                  </Link>
                </HoverUser>
              </li>
            ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default StatNumber;
