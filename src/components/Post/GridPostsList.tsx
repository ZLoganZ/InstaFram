import { Link } from "@tanstack/react-router";

import PostStats from "@/components/Post/PostStats";
import HoverUser from "@/components/User/HoverUser";
import { getImageURL } from "@/lib/utils";
import { IPost } from "@/types";

interface IGridPostsList {
  posts: IPost[];
  showUser?: boolean;
  showStats?: boolean;
}

const GridPostsList = ({
  posts,
  showStats = false,
  showUser = false,
}: IGridPostsList) => {
  return (
    <ul className="grid w-full max-w-5xl grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <li key={post._id} className="relative h-72 min-w-[18rem]">
          <Link
            className="flex h-full w-full cursor-pointer overflow-hidden rounded-[24px] border border-light-4 dark:border-dark-4"
            to="/post/$postID"
            params={{ postID: post._id }}
          >
            <img
              src={getImageURL(post.image, "post")}
              alt="image"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </Link>
          <div className="flex-between absolute bottom-0 w-full gap-2 rounded-b-[24px] bg-gradient-to-t from-dark-3 to-transparent p-5">
            {showUser && (
              <HoverUser userID={post.creator._id} showFollowButton>
                <Link
                  className="flex flex-1 items-center justify-start gap-2"
                  to="/$profileID"
                  params={{ profileID: post.creator.alias || post.creator._id }}
                >
                  <img
                    src={
                      getImageURL(post.creator.image, "avatar") ||
                      "/assets/icons/profile-placeholder.svg"
                    }
                    alt="avatar"
                    className="size-8 rounded-full"
                    loading="lazy"
                  />
                  <p className="line-clamp-1 text-white hover:underline">
                    {post.creator.name}
                  </p>
                </Link>
              </HoverUser>
            )}
            {showStats && <PostStats post={post} textWhite />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostsList;
