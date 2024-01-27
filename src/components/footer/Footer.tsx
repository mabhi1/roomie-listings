import Link from "next/link";

export default function Footer() {
  return (
    <div className="flex w-full flex-col items-center justify-center bg-secondary p-3 md:flex-row md:gap-2">
      <div>Copyright &copy;2024. ROOMIELISTINGS.COM.</div>
      <Link href="/terms&conditions" className="text-primary underline underline-offset-2">
        Terms and Conditions
      </Link>
    </div>
  );
}
