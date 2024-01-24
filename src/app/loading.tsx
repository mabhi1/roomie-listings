import FullWrapper from "@/components/page/FullWrapper";
import Spinner from "@/components/page/Spinner";

export default function Loading() {
  return (
    <FullWrapper>
      <div className="flex flex-col gap-10 justify-center items-center mt-32">
        <Spinner size="large" />
      </div>
    </FullWrapper>
  );
}
