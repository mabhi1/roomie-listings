import FullWrapper from "@/components/page/FullWrapper";

export default function Layout({ children, comments }: { children: React.ReactNode; comments: React.ReactNode }) {
  return (
    <FullWrapper className="gap-5">
      {children}
      {comments}
    </FullWrapper>
  );
}
