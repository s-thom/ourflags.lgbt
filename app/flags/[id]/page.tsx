import { getFlagData } from "../../../lib/getFlagData";

export default async function FlagsIdPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getFlagData(params.id);
  return (
    <main>
      <div className="flex gap-1">
        <div className="w-16 h-9 bg-slate-500"></div>
        <div>
          <h1>{data.meta.name}</h1>
        </div>
      </div>
      <div>{data.content}</div>
    </main>
  );
}
