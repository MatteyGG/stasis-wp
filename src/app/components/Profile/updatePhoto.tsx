import Image from "next/image";
import UploadImage from "../userImageUpload";

export default function UpdatePhoto({
  username,
  userId,
}: {
  username: string;
  userId: string;
}) {
  return (
    <>
      <div className="mx-2 md:mx-12 grid grid-cols-1 md:grid-cols-2 gap-2 ">
        <div className="h-full">
          <h1>Фото вашей техники</h1>
          <div className="h-1/6 hover:h-1/2 shadow-md transform duration-500 delay-500">
            <Image
              className="w-full shadow-2xl border-8 border-green-600 shadow-black object-fill aspect-[3/2] rounded-3xl rounded-b-none"
              src={"/source/help/army.png"}
              alt={username}
              width={700}
              height={700}
            />
          </div>
          <div className="hover:-translate-y-12 shadow-md transform duration-500 delay-500">
            <Image
              className="w-full border-8 border-orange-600 shadow-2xl shadow-black object-fill aspect-[3/2] rounded-3xl rounded-b-none"
              src={"/userScreen/" + "userScreen_" + userId + ".png"}
              alt={username}
              width={700}
              height={700}
            />
            <UploadImage method="userScreen" userId={userId}>
              Обновить
            </UploadImage>
          </div>
        </div>
        <div className="h-full">
          <h1>Фото вашего профиля</h1>
          <div className="h-1/6 hover:h-1/2 shadow-md transform duration-500 delay-500">
            <Image
              className="w-full shadow-2xl border-8 border-green-600 shadow-black object-fill aspect-[3/2] rounded-3xl rounded-b-none"
              src={"/source/help/profile.png"}
              alt={username}
              width={700}
              height={700}
            />
          </div>
          <div className="hover:-translate-y-1/4 shadow-md transform duration-500 delay-500">
            <Image
              className="w-full shadow-2xl border-8 border-orange-600 shadow-black object-fill aspect-[3/2] rounded-3xl rounded-b-none"
              src={"/userProfile/" + "userProfile_" + userId + ".png"}
              alt={username}
              width={700}
              height={700}
            />
            <UploadImage method="userProfile" userId={userId}>
              Обновить
            </UploadImage>
          </div>
        </div>
      </div>
    </>
  );
}
