import FullWrapper from "@/components/page/FullWrapper";
import Spinner from "@/components/page/Spinner";

export default function Loading() {
  return (
    <FullWrapper>
      <div className="mt-32 flex flex-col items-center justify-center gap-10">
        <Spinner size="large" />
      </div>
    </FullWrapper>
  );
}
