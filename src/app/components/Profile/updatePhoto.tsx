import Image from "next/image";

export default function UpdatePhoto({username, userId} : {username: string, userId: string}) {
  return (
    <>
      <div className="">
        <Image
          className="z-20 object-none aspect-[3/2] rounded-3xl hover:object-cover hover:translate-x-1/2 hover:grow hover:shadow-lg hover:scale-[2.3] transition-all delay-100 duration-500"
          style={{
            position: "relative",
            zIndex: 3, // Полоса прогресса под текстом
          }}
          src={"/userScreen/" + "userScreen_" + userId + ".png"}
          alt={username}
          width={700}
          height={700}
        />
      </div>
    </>
  );
}
