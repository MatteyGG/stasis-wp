import Image from "next/image";

export default function Home() {
    const army = ["/Icon-howitzer.webp", "/Icon-HTank.webp", "/Icon-MTank.webp"];
    const nation = ["",]
    return (
      <div className="text-3xl flex justify-center">
        <h1>Test</h1>
        
        <Image src={army[0]} alt={army[1]} height={64} width={64} /> 
      </div>
    );
}