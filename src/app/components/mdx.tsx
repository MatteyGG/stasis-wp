/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
