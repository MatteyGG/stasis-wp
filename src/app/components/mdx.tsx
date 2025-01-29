import type { GetStaticProps } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";


interface Props {
  mdxSource: any;
}

export default function MDXPage({ mdxSource }: Props) {
  return (
    <div>
      <MDXRemote {...mdxSource}/>
    </div>
  );
}
