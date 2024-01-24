import FullWrapper from "./FullWrapper";
import Spinner from "./Spinner";

export default function LoadingPage() {
  return (
    <FullWrapper>
      <div className="flex items-center gap-5 animate-pulse">
        <div className="rounded-full h-8 w-8 bg-accent"></div>
        <div className="rounded h-3 w-16 bg-accent mr-auto"></div>
        <div className="rounded h-3 w-16 bg-accent hidden md:block"></div>
        <div className="rounded h-3 w-16 bg-accent hidden md:block"></div>
        <div className="rounded h-3 w-8 md:w-16 bg-accent"></div>
        <div className="rounded h-3 w-8 md:w-16 bg-accent"></div>
      </div>
      <div className="flex flex-col gap-10 justify-center items-center mt-32">
        <Spinner size="large" />
      </div>
    </FullWrapper>
  );
}
