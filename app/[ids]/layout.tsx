import Link from "next/link";

export default function IdsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <div className="prose prose-neutral dark:prose-invert p-4 mt-10 md:mt-20 bg-white/30 rounded-xl shadow-inner max-w-sm sm:max-w-md md:max-w-lg mx-auto px-4 sm:px-6 md:px-8">
        <p>
          <Link
            href="/"
            className="underline decoration-dotted hover:decoration-solid focus:decoration-solid"
          >
            Choose your flags
          </Link>{" "}
          to share with the world, or have a look at{" "}
          <Link
            href="/flags"
            className="underline decoration-dotted hover:decoration-solid focus:decoration-solid"
          >
            all flags
          </Link>{" "}
          to learn more about queer history and representation.
        </p>
      </div>
    </div>
  );
}
