import { Link, useNavigate } from "@tanstack/react-router";

import PostStats from "@/components/Post/PostStats";
import HoverUser from "@/components/User/HoverUser";
import PostVisibility from "@/components/Post/PostVisibility";
import { FILTERS } from "@/lib/constants";
import { getDateTimeToNow, getImageURL } from "@/lib/utils";
import { IPost } from "@/types";

interface IPostCard {
  post: IPost;
}

const PostCard = ({ post }: IPostCard) => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-screen-sm rounded-3xl border border-light-4 bg-light-2 p-5 dark:border-dark-4 dark:bg-dark-2 lg:p-7">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <HoverUser userID={post.creator._id} showFollowButton>
            <Link
              to="/$profileID"
              params={{ profileID: post.creator.alias || post.creator._id }}
            >
              <img
                className="size-12 rounded-full ring-primary hover:ring-2"
                src={
                  getImageURL(post.creator.image, "avatar") ||
                  "/assets/icons/profile-placeholder.svg"
                }
                alt="avatar"
                loading="lazy"
              />
            </Link>
          </HoverUser>
          <div className="flex flex-col">
            <HoverUser userID={post.creator._id} showFollowButton>
              <Link
                to="/$profileID"
                params={{ profileID: post.creator.alias || post.creator._id }}
              >
                <p className="base-medium lg:body-bold line-clamp-1 hover:underline">
                  {post.creator.name}
                </p>
              </Link>
            </HoverUser>
            <Link
              to="/$profileID"
              params={{ profileID: post.creator.alias || post.creator._id }}
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
      </div>
      <>
        <div className="small-medium lg:base-medium text-pretty py-5">
          <p>{post.content}</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="line-clamp-1 cursor-pointer text-[#7878A3] hover:underline"
                onClick={() =>
                  navigate({
                    to: "/explore",
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
        {post.image && (
          <Link
            to="/post/$postID"
            params={{ postID: post._id }}
            className="flex-center"
          >
            <img
              src={getImageURL(post.image, "post")}
              alt="post"
              className="mb-5 h-64 w-full rounded-[24px] object-cover xs:h-[400px] lg:h-[450px]"
              loading="lazy"
            />
          </Link>
        )}
      </>
      <PostStats post={post} />
    </div>
  );
};

export default PostCard;
