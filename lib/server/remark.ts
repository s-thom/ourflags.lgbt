// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { ComponentType, createElement, Fragment } from "react";
import rehypeReact from "rehype-react";
import rehypeSanitize from "rehype-sanitize";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { LinkWithIcon } from "../components/general/LinkWithIcon";

export async function renderMarkdownToReact(
  text: string,
): Promise<JSX.Element> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeReact, {
      createElement,
      Fragment,
      components: {
        a: LinkWithIcon as ComponentType<unknown>,
      },
    })
    .process(text);

  return result.result;
}
