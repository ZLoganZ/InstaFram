import { useMemo } from "react";

import Loader from "@/components/Shared/Loader";
import { Button } from "@/components/ui/button";
import CommentCard from "@/components/Comment/CommentCard";
import { useGetCommentsByPostID } from "@/lib/hooks/query";
import { IReplyTo } from "@/types";

interface ICommentsListProps {
  postID: string;
  commentsCount: number;
  replyTo: IReplyTo | undefined;
  setReplyTo: React.Dispatch<React.SetStateAction<IReplyTo | undefined>>;
}

const CommentsList = ({
  postID,
  commentsCount,
  replyTo,
  setReplyTo,
}: ICommentsListProps) => {
  const {
    comments,
    isLoadingComments,
    isFetchingNextComments,
    fetchNextComments,
  } = useGetCommentsByPostID(postID);

  const totalDisplayedComments = useMemo(() => {
    if (comments)
      return (
        comments.length +
        comments.reduce((sum, comment) => sum + comment.replies.length, 0)
      );
    return 0;
  }, [comments]);

  return (
    <div className="w-full max-w-5xl">
      <h3 className="body-bold md:h3-bold my-10 w-full">Comments</h3>
      {isLoadingComments || !comments ? (
        <Loader />
      ) : comments.length === 0 ? (
        <p className="mt-10 w-full text-center text-[#5C5C7B]">
          No comments yet
        </p>
      ) : (
        <ul className="custom-scrollbar flex max-h-[30rem] flex-col gap-5 overflow-auto rounded-2xl bg-light-2 p-5 lg:max-h-[35rem] dark:bg-dark-2">
          {comments.map((comment) => (
            <li key={comment._id}>
              <CommentCard
                comment={comment}
                replyTo={replyTo}
                setReplyTo={setReplyTo}
              />
            </li>
          ))}
          {commentsCount > totalDisplayedComments && (
            <Button
              type="button"
              variant="link"
              className="mt-2 w-full text-[#5C5C7B]"
              disabled={isFetchingNextComments}
              onClick={() => fetchNextComments()}
            >
              {isFetchingNextComments ? (
                <div className="flex-center gap-2">
                  <Loader /> Loading...
                </div>
              ) : (
                <>
                  View {commentsCount - totalDisplayedComments}
                  &nbsp;more comment
                  {commentsCount - totalDisplayedComments > 1 && "s"}
                </>
              )}
            </Button>
          )}
        </ul>
      )}
    </div>
  );
};

export default CommentsList;
