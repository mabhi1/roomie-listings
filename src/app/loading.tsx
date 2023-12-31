import FullWrapper from "@/components/page/FullWrapper";
import Spinner from "@/components/page/Spinner";

export default function Loading() {
  return (
    <FullWrapper className="items-center mt-24">
      <Spinner size="large" />
    </FullWrapper>
  );
}
