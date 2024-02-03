import { Link } from "@tanstack/react-router";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
// import HoverUser from '@/components/Post/HoverUser';
import { capitalizeFirstLetter, cn, getImageURL } from "@/lib/utils";
import { IUser } from "@/types";

interface IStatNumber {
  dataList: IUser[];
  type: "like" | "comment";
  dataCount: number;
  textWhite?: boolean;
}

const StatNumber = ({ dataList, textWhite, dataCount, type }: IStatNumber) => {
  return (
    <Dialog modal>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <p
                className={cn(
                  "small-medium lg:base:medium line-clamp-1 cursor-pointer hover:underline",
                  textWhite && "text-white",
                )}
              >
                {dataCount}
              </p>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <ul className="flex flex-col gap-2">
              {dataList.length === 0 ? (
                <li className="flex items-center">
                  <p className="small-regular">
                    No one has {type}d this post yet
                  </p>
                </li>
              ) : (
                dataList.slice(0, 10).map((data) => (
                  <li key={data._id}>
                    <Link
                      to="/$profileID"
                      params={{ profileID: data.alias || data._id }}
                      className="group flex items-center gap-2.5"
                    >
                      <img
                        src={
                          getImageURL(data.image, "miniAvatar") ||
                          "/assets/icons/profile-placeholder.svg"
                        }
                        alt="avatar"
                        className="size-8 rounded-full"
                      />
                      <p className="small-regular line-clamp-1 group-hover:underline">
                        {data.name}
                      </p>
                    </Link>
                  </li>
                ))
              )}
              {dataList.length > 10 && (
                <li className="flex items-center">
                  <p className="small-regular">
                    and {dataList.length - 10} more...
                  </p>
                </li>
              )}
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex w-full justify-start">
          <DialogTitle className="flex-start gap-3">
            <img
              src={`/assets/icons/${type}.svg`}
              alt={type}
              className="size-9"
            />
            <p className="h3-bold md:h2-bold w-full text-left">
              {capitalizeFirstLetter(type)}s
            </p>
          </DialogTitle>
          <DialogDescription>
            {dataList.length === 0
              ? `No one has ${type}d this post yet`
              : dataList.length === 1
                ? `1 person ${type}s this post`
                : `${dataList.length} people ${type} this post`}
          </DialogDescription>
        </DialogHeader>
        <ul className="custom-scrollbar flex max-h-[40rem] flex-col gap-5 overflow-auto">
          {dataList.length !== 0 &&
            dataList.map((data) => (
              <li key={data._id}>
                <div className="flex items-center gap-4">
                  {/* <HoverUser userID={data._id} showFollowButton> */}
                  <Link
                    to="/$profileID"
                    params={{ profileID: data.alias || data._id }}
                  >
                    <img
                      src={
                        getImageURL(data.image, "miniAvatar") ||
                        "/assets/icons/profile-placeholder.svg"
                      }
                      alt="avatar"
                      className="size-12 rounded-full"
                    />
                  </Link>
                  {/* </HoverUser> */}
                  {/* <HoverUser userID={data._id} showFollowButton> */}
                  <Link
                    to="/$profileID"
                    params={{ profileID: data.alias || data._id }}
                    className="flex flex-col"
                  >
                    <p className="base-regular line-clamp-1 hover:underline">
                      {data.name}
                    </p>
                    <p className="small-regular text-[#7878A3]">
                      @{data.alias}
                    </p>
                  </Link>
                  {/* </HoverUser> */}
                </div>
              </li>
            ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default StatNumber;
