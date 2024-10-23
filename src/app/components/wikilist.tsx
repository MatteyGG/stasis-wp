import { prisma } from "../prisma"
import Link from "next/link";



export default async function WikiList() {
    const wikis = await prisma.wiki.findMany();
    return (
        <ul className="space-y-2">
            {wikis.map((wiki, index) => (
                <li key={index}>
                    <Link href={`wiki/${wiki.category}/${wiki.pageId}`} className="text-lg font-medium underline hover:text-blue-500">{wiki.title}</Link>
                </li>
            ))}
        </ul>
    );
}