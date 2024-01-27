import Link from "next/link";

export default function Footer() {
  return (
    <div className="w-full bg-secondary p-3 text-center">
      Copyright &copy;2024. ROOMIELISTINGS.COM.{" "}
      <Link href="/terms&conditions" className="text-primary underline underline-offset-2">
        Terms and Conditions
      </Link>
    </div>
  );
}
