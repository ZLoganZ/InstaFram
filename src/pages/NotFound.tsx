import { Link } from "@tanstack/react-router";

const NotFound = () => {
  return (
    <section className="container relative grid min-h-full w-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <div className="flex-center gap-1">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            className="size-14 sm:size-16"
          />
          <p className="h2-bold select-none font-mono">InstaFram</p>
        </div>
        <h2 className="h2-bold sm:h1-bold mt-2 text-gray-900 dark:text-gray-100">
          You have found a secret place.
        </h2>
        <p className="base-regular mt-3 max-w-[500px] text-gray-600 dark:text-gray-400">
          Unfortunately, this is only a 404 page. You may have mistyped the
          address, or the page has been moved to another URL.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="small-semibold rounded-md bg-primary px-3.5 py-2.5 text-light-1
            shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 
            focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Go back to home page
          </Link>
          <Link to="/" className="small-semibold line-clamp-1 hover:underline">
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
