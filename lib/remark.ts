import { createElement, Fragment } from "react";
import rehypeReact from "rehype-react";
import rehypeSanitize from "rehype-sanitize";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export async function renderMarkdownToReact(
  text: string
): Promise<JSX.Element> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeReact, { createElement, Fragment })
    .process(text);

  return result.result;
}
