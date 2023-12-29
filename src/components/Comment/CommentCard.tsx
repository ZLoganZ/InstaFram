import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";

import Loader from "@/components/Shared/Loader";
import { useAuth } from "@/lib/hooks/useAuth";
import { useLikeComment } from "@/lib/hooks/mutation";
import { useGetRepliesByCommentID } from "@/lib/hooks/query";
import { cn, getDateTimeToNow, getImageURL } from "@/lib/utils";
import { IComment, IReplyTo } from "@/types";
import HoverUser from "../User/HoverUser";

interface ICommentProps {
  comment: IComment;
  replyTo: IReplyTo | undefined;
  setReplyTo: React.Dispatch<React.SetStateAction<IReplyTo | undefined>>;
  parentID?: string;
}

const CommentCard = ({ comment, replyTo, setReplyTo }: ICommentProps) => {
  const { currentUser } = useAuth();
  const [likes, setLikes] = useState(comment.likes.map((like) => like._id));

  const checkIsLiked = useMemo(() => {
    return likes.includes(currentUser._id);
  }, [likes, currentUser._id]);

  const {
    replies,
    isLoadingReplies,
    fetchNextReplies,
    isFetchingNextReplies,
    hasNextReplies,
  } = useGetRepliesByCommentID(comment._id);
  const { likeComment, isLoadingLikeComment } = useLikeComment();

  const remainingReplies = comment.replies.length - replies?.length;

  const handleLikeComment = async () => {
    const hasLiked = likes.includes(currentUser._id);

    if (hasLiked) {
      setLikes(likes.filter((like) => like !== currentUser._id));
    } else {
      setLikes([...likes, currentUser._id]);
    }

    await likeComment(comment._id);
  };

  return (
    <article className="flex w-full flex-col">
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <HoverUser userID={comment.user._id} showFollowButton>
              <Link
                className="size-11"
                to="/$profileID"
                params={{ profileID: comment.user.alias || comment.user._id }}
              >
                <img
                  className="cursor-pointer rounded-full ring-primary hover:ring-2"
                  src={
                    getImageURL(comment.user.image, "avatar") ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="user_community_image"
                />
              </Link>
            </HoverUser>

            {/* <div className='mt-2 w-0.5 grow rounded-full bg-dark-3/50 dark:bg-light-3/50' /> */}
          </div>

          <div className="flex w-full flex-col">
            <div className="flex items-baseline gap-2">
              <HoverUser userID={comment.user._id} showFollowButton>
                <Link
                  className="line-clamp-1 w-fit hover:underline"
                  to="/$profileID"
                  params={{ profileID: comment.user.alias || comment.user._id }}
                >
                  <h4 className="base-semibold cursor-pointer text-dark-1 dark:text-light-1">
                    {comment.user.name}
                  </h4>
                </Link>
              </HoverUser>

              <p className="subtle-medium">
                {getDateTimeToNow(comment.createdAt)}
              </p>
            </div>

            <div className="flex flex-row justify-between">
              <p className="small-regular mt-2 text-dark-2 dark:text-light-2">
                {comment.content}
              </p>
              <div className="flex-center flex-col gap-0.5 ">
                <img
                  className={cn(
                    "size-4 cursor-pointer object-contain hover:scale-110 md:size-5",
                    isLoadingLikeComment && "animate-pulse",
                  )}
                  src={
                    checkIsLiked
                      ? "/assets/icons/liked.svg"
                      : "/assets/icons/like.svg"
                  }
                  alt="like"
                  onClick={handleLikeComment}
                />
                <p className="subtle-semibold lg:small:medium">
                  {comment.likes.length}
                </p>
              </div>
            </div>

            <div className="mb-2 flex flex-col gap-2">
              <div className="flex-center w-fit gap-2">
                {!comment.isChild && (
                  <img
                    className={cn(
                      "size-4 cursor-pointer object-contain hover:scale-110 md:size-5",
                      replyTo &&
                        replyTo.to === comment._id &&
                        "drop-shadow-2xl",
                    )}
                    src="/assets/icons/reply.svg"
                    alt="reply"
                    onClick={() =>
                      setReplyTo({ to: comment._id, user: comment.user })
                    }
                  />
                )}
                <img
                  className="size-4 cursor-pointer object-contain hover:scale-110 md:size-5"
                  src="/assets/icons/send.svg"
                  alt="send"
                />
              </div>

              {!comment.isChild && comment.replies.length !== 0 && (
                <>
                  <div className="flex w-full max-w-5xl flex-col gap-2">
                    {isLoadingReplies ? (
                      <div className="flex-center gap-2">
                        <Loader />
                        Loading...
                      </div>
                    ) : replies.length === 0 ? (
                      <p className="mt-10 w-full text-center text-[#5C5C7B]">
                        No replies yet
                      </p>
                    ) : (
                      <ul className="flex flex-col gap-5 rounded-2xl bg-light-2 pt-5 dark:bg-dark-2">
                        {replies.map((reply) => (
                          <li key={reply._id}>
                            <CommentCard
                              comment={reply}
                              replyTo={replyTo}
                              setReplyTo={setReplyTo}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {hasNextReplies && remainingReplies > 0 && (
                    <div
                      className="group flex w-fit cursor-pointer gap-1"
                      onClick={() => fetchNextReplies()}
                    >
                      {isFetchingNextReplies ? (
                        <div className="flex-center subtle-medium gap-2">
                          <Loader />
                          Loading...
                        </div>
                      ) : (
                        <>
                          <p className="subtle-medium line-clamp-1 group-hover:underline">
                            {remainingReplies} repl
                            {remainingReplies > 1 ? "ies" : "y"}
                          </p>
                          <img
                            src="/assets/icons/reply.svg"
                            alt="reply"
                            className="size-4 object-contain"
                          />
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CommentCard;
