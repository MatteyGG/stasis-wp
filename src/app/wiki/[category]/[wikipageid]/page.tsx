import { prisma } from "@/app/prisma";
import { MDXRemote } from "next-mdx-remote/rsc";

import Link from "next/link";

export default async function Wiki_page({
  params,
}: {
  params: {
    category: string;
    wikipageid: string;
  };
}) {
  const wiki = await prisma.wiki.findUniqueOrThrow({
    where: {
      pageId: params.wikipageid,
    },
  });
  return (
    <>
      <h1 className="text-6xl text-primaly text-center w-full my-6">
        Страница в категории <Link href={`../${wiki.category}`}>{decodeURIComponent(params.category)}</Link>
        <br />
        <b>{wiki.title}</b>
      </h1>
      <div className="wiki container ">
          <MDXRemote source={wiki.md} />
      </div>
    </>
  );
}
