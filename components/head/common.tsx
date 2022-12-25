import * as site from "../../data/site";

export interface CommonHeadProps {
  title: string | undefined;
  path: string;
}

export function CommonHead({ path, title }: CommonHeadProps) {
  return (
    <>
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <link rel="canonical" href={new URL(path, site.baseUrl).toString()} />
      <title>{title ? `${title} - ${site.name}` : site.name}</title>
    </>
  );
}
