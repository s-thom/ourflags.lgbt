import { parseShareString } from "../../../lib/shortcodes";

export default async function FlagsIdPage({
  params,
}: {
  params: { ids: string };
}) {
  const flags = parseShareString(params.ids);

  return (
    <main>
      {flags.map((flag) => (
        <div key={flag.id}>
          <div className="flex gap-1">
            <div className="w-16 h-9 bg-slate-500"></div>
            <div>
              <h1>{flag.name}</h1>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}
