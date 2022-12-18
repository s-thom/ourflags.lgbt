import FLAGS from "../../../data/meta";
import { getFlagData } from "../../../lib/getFlagData";
import { renderMarkdownToReact } from "../../../lib/remark";

export default async function FlagsIdPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getFlagData(params.id);

  const pageContent = await renderMarkdownToReact(data.content);

  return (
    <main>
      <div className="flex gap-1">
        <div className="w-16 h-9 bg-slate-500"></div>
        <div>
          <h1>{data.meta.name}</h1>
        </div>
      </div>
      <div>{pageContent}</div>
    </main>
  );
}

export async function generateStaticParams() {
  return FLAGS.map((flag) => ({
    id: flag.id,
  }));
}
