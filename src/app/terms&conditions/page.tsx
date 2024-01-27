import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import termsConditions from "@/lib/termsConditions.json";

export default function TermsAndConditions() {
  return (
    <FullWrapper className="gap-3 md:gap-5">
      <PageHeader heading="Terms and Conditions" />
      {termsConditions.map(term => (
        <div key={term.title} className="space-y-1 md:space-y-2">
          <div className="text-sm underline underline-offset-4 md:text-base">{term.title}</div>
          <div>{term.description}</div>
        </div>
      ))}
    </FullWrapper>
  );
}
