import { prisma } from "@/app/prisma";
import { MDXRemote } from "next-mdx-remote/rsc";

import Link from "next/link";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";

const options = {
  mdxOptions: {
		remarkPlugins: [remarkGfm, remarkToc],
    rehypePlugins: [],
  },
};


export default async function Wiki_page({
  params,
}: {
  params: {
    category: string;
    wikipageid: string;
  };
}) {
  const wiki = await prisma.wiki.findUnique({
    where: {
      pageId: params.wikipageid,
    },
  });

  if (!wiki) {
    return <p>Страница не найдена</p>;
  }

  return (
    <>
      <div className="wiki container border-2 border-primaly shadow-2xl shadow-black mt-12 mx-auto flex flex-wrap p-4 rounded-xl">
        <h1 className="text-2xl text-left text-primaly w-full my-6">
          <Link href={`../${wiki.category}`}>
            {decodeURIComponent(params.category)}
          </Link>
          <b>:{wiki.title}</b>
        </h1>
        <MDXRemote source={wiki.md} options={options} />
      </div>
    </>
  );
}

