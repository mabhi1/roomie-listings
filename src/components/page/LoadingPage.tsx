import FullWrapper from "./FullWrapper";
import Spinner from "./Spinner";

export default function LoadingPage() {
  return (
    <FullWrapper>
      <div className="mt-5 flex animate-pulse items-center gap-5">
        <div className="h-8 w-8 rounded-full bg-accent"></div>
        <div className="mr-auto h-3 w-16 rounded bg-accent"></div>
        <div className="hidden h-3 w-16 rounded bg-accent md:block"></div>
        <div className="hidden h-3 w-16 rounded bg-accent md:block"></div>
        <div className="h-3 w-8 rounded bg-accent md:w-16"></div>
        <div className="h-3 w-8 rounded bg-accent md:w-16"></div>
      </div>
      <div className="mt-32 flex flex-col items-center justify-center gap-10">
        <Spinner size="large" />
      </div>
    </FullWrapper>
  );
}
