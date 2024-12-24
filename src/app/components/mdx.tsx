import type { GetStaticProps } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";


interface Props {
  mdxSource: MDXRemoteSerializeResult;
}

export default function MDXPage({ mdxSource }: Props) {
  return (
    <div>
      <MDXRemote {...mdxSource}/>
    </div>
  );
}

export const getStaticProps: GetStaticProps<{
  mdxSource: MDXRemoteSerializeResult;
}> = async () => {
  const mdxSource = await serialize("some *mdx* content: <ExampleComponent />");
  return { props: { mdxSource } };
};
