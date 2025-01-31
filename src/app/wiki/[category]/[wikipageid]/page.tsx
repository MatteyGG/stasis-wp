import { prisma } from "@/app/prisma";
import { MDXRemote } from "next-mdx-remote/rsc";

import Link from "next/link";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import remarkFlexibleContainers from "remark-flexible-containers";

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkToc, remarkFlexibleContainers],
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
    return (
      <>
        <div className="flex items-center justify-center">
          <div className="w-1/2 h-1 bg-orange-500"></div>
          <div className="w-1/2 h-1 bg-black"></div>
        </div>
        <p className="text-center text-2xl text-primaly p-4 border-2 border-dashed border-primaly rounded-xl">
          Страница не найдена
        </p>
      </>
    );
  }

  return (
    <>
      <div className="wiki container bg-white border-none border-primaly shadow-2xl shadow-black  mx-auto flex flex-wrap p-4 rounded-xl">
        <h1 className="text-2xl text-left text-primaly w-full my-6">
          <Link href={`../${wiki.category}`}>
            {decodeURIComponent(params.category)}
          </Link>
          /<b>{wiki.title}</b>
        </h1>
        <MDXRemote source={wiki.md} options={options} />
      </div>
    </>
  );
}
