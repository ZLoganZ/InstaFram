import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useRouter,
  getRouteApi,
} from "@tanstack/react-router";

import NotFound from "@/pages/NotFound";

import { useGetPost, useGetRelatedPosts } from "@/lib/hooks/query";
import { useDeletePost } from "@/lib/hooks/mutation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { FILTERS } from "@/lib/constants";
import { getDateTimeToNow, getImageURL } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Shared/Loader";
import HoverUser from "@/components/User/HoverUser";
import CommentsList from "@/components/Comment/CommentsList";
import PostStats from "@/components/Post/PostStats";
import GridPostsList from "@/components/Post/GridPostsList";
import PostVisibility from "@/components/Post/PostVisibility";
import PostOptions from "@/components/Post/PostOptions";
import CommentInput from "@/components/Forms/Comment/CommentInput";
import { IReplyTo } from "@/types";

const routeApi = getRouteApi("/main/post/$postID");

const PostDetails = () => {
  const { postID } = routeApi.useParams();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { history } = useRouter();
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const { post, isLoadingPost, errorPost } = useGetPost(postID);
  const { relatedPosts, isLoadingRelatedPosts } = useGetRelatedPosts(postID);

  const { deletePost } = useDeletePost();

  const [replyTo, setReplyTo] = useState<IReplyTo>();

  const handleDeletePost = () => {
    deletePost(postID, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Post deleted successfully",
        });
        history.back();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
        });
      },
    });
  };

  useEffect(() => {
    if (post) document.title = `${post.content.slice(0, 45)} - InstaFram`;
  }, [post]);

  return (
    <div className="custom-scrollbar flex flex-1 flex-col items-center gap-10 overflow-scroll px-5 py-10 md:p-14">
      {errorPost ? (
        <NotFound />
      ) : isLoadingPost || !post ? (
        <Loader />
      ) : (
        <>
          <div className="hidden w-full max-w-5xl md:flex">
            <Button
              onClick={() => history.back()}
              className="gap-2"
              variant="ghost"
            >
              <img src="/assets/icons/back.svg" alt="back" className="size-6" />
              <p className="small-medium lg:base-medium">Back</p>
            </Button>
          </div>
          <div className="flex w-full max-w-5xl flex-col rounded-[30px] border border-light-4 bg-light-2 dark:border-dark-4 dark:bg-dark-2 xl:flex-row xl:rounded-l-[24px]">
            <img
              src={getImageURL(post.image, "post")}
              alt="post"
              className="h-80 rounded-t-[30px] bg-light-2 object-cover p-5 dark:bg-dark-2 lg:h-[480px] xl:w-[48%] xl:rounded-l-[24px] xl:rounded-tr-none"
            />
            <div className="flex flex-1 flex-col items-start gap-5 rounded-[30px] bg-light-2 p-8 dark:bg-dark-2 lg:gap-7">
              <div className="flex-between w-full">
                <div className="flex items-center gap-3">
                  <HoverUser userID={post.creator._id} showFollowButton>
                    <Link
                      to="/$profileID"
                      params={{
                        profileID: post.creator.alias || post.creator._id,
                      }}
                    >
                      <img
                        className="size-8 rounded-full ring-primary hover:ring-2 lg:size-12"
                        src={
                          getImageURL(post.creator.image, "avatar") ||
                          "/assets/icons/profile-placeholder.svg"
                        }
                        alt="avatar"
                      />
                    </Link>
                  </HoverUser>
                  <div className="flex flex-col">
                    <HoverUser userID={post.creator._id} showFollowButton>
                      <Link
                        to="/$profileID"
                        params={{
                          profileID: post.creator.alias || post.creator._id,
                        }}
                      >
                        <p className="base-medium lg:body-bold line-clamp-1 hover:underline">
                          {post.creator.name}
                        </p>
                      </Link>
                    </HoverUser>
                    <Link
                      to="/$profileID"
                      params={{
                        profileID: post.creator.alias || post.creator._id,
                      }}
                      className="flex-center gap-1 text-[#7878A3]"
                    >
                      <PostVisibility visibility={post.visibility} />-
                      <p className="subtle-semibold lg:small-regular line-clamp-1 hover:underline">
                        {getDateTimeToNow(post.createdAt)}
                      </p>
                      -
                      <p className="subtle-semibold lg:small-regular line-clamp-1 hover:underline">
                        {post.location}
                      </p>
                    </Link>
                  </div>
                </div>

                {currentUser._id === post.creator._id && (
                  <PostOptions
                    key={postID}
                    open={open}
                    setOpen={setOpen}
                    handleDeletePost={handleDeletePost}
                  />
                )}
              </div>

              <hr className="w-full border border-light-4/80 dark:border-dark-4/80" />

              <div className="small-medium lg:base-regular flex w-full flex-1 flex-col text-pretty">
                <p>{post.content}</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <li
                      key={tag}
                      className="line-clamp-1 cursor-pointer text-[#7878A3] hover:underline"
                      onClick={() =>
                        navigate({
                          to: `/explore`,
                          search: (pre) => ({
                            ...pre,
                            search: tag,
                            filter: FILTERS.ALL,
                          }),
                        })
                      }
                    >
                      #{tag}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full">
                <PostStats post={post} />
              </div>
            </div>
          </div>

          <CommentsList
            commentsCount={post.comments.length}
            postID={postID}
            replyTo={replyTo}
            setReplyTo={setReplyTo}
          />

          <CommentInput
            currentUser={currentUser}
            postID={postID}
            replyTo={replyTo}
            setReplyTo={setReplyTo}
          />

          <div className="w-full max-w-5xl">
            <h3 className="body-bold md:h3-bold my-10 w-full">
              More Related Posts
            </h3>
            {isLoadingRelatedPosts || !relatedPosts ? (
              <Loader />
            ) : relatedPosts.length === 0 ? (
              <p className="mt-10 w-full text-center text-[#5C5C7B]">
                No related posts
              </p>
            ) : (
              <GridPostsList posts={relatedPosts} showStats showUser />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PostDetails;
