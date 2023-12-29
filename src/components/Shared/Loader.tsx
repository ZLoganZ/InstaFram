import { cn } from "@/lib/utils";

interface ILoaderProps {
  className?: string;
}

const Loader = ({ className }: ILoaderProps) => {
  return (
    <div className={cn("flex-center w-full", className)}>
      <img
        className="size-6 animate-spin invert dark:invert-0"
        src="/assets/icons/loader.svg"
        alt="loader"
      />
    </div>
  );
};

export default Loader;
