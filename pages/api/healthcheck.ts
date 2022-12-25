// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { FLAGS } from "../../data/flags/flags";

type Data = {
  ok: boolean;
  random?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({
    ok: true,
    random: `/flags/${FLAGS[Math.floor(Math.random() * FLAGS.length)]!.id}`,
  });
}
