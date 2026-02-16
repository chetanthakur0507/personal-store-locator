import Link from 'next/link';

export default function Cta() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16">
      <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-[#FF9644] px-8 py-10 text-white md:flex-row">
        <div>
          <h2 className="text-2xl font-semibold">Role based login enabled</h2>
          <p className="mt-2 text-sm text-[#FFCE99]">
            Staff aur admin alag dashboards ke sath. Customer bhi home page dekh sakta hai.
          </p>
        </div>
        <Link
          href="/login"
          className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#FF9644] shadow"
        >
          Go to Login
        </Link>
      </div>
    </section>
  );
}
