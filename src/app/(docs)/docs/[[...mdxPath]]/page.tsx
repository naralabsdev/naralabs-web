import { generateStaticParamsFor, importPage } from "nextra/pages";
import type { Metadata } from "next";

import { useMDXComponents as getMDXComponents } from "@/mdx-components";

export const generateStaticParams = generateStaticParamsFor("mdxPath");

type PageProps = {
  params: Promise<{ mdxPath?: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { mdxPath } = await params;
  const { metadata } = await importPage(mdxPath);
  return metadata;
}

const Wrapper = getMDXComponents().wrapper;

export default async function DocsPage(props: PageProps) {
  const params = await props.params;
  const { mdxPath } = params;
  const {
    default: MDXContent,
    toc,
    metadata,
    sourceCode,
  } = await importPage(mdxPath);

  if (!Wrapper) {
    return <MDXContent {...props} params={params} />;
  }

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
}
