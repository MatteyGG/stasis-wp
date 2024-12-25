import Image from "next/image";
import UploadImage from "../userImageUpload";

export default function UpdatePhoto({username, userId} : {username: string, userId: string}) {
  return (
    <>
      <div className="md:mx-12 grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <h1>Фото вашей техники</h1>
          <Image
            className="w-full object-fill aspect-[3/2] rounded-3xl rounded-b-none"
            src={"/userScreen/" + "userScreen_" + userId + ".png"}
            alt={username}
            width={700}
            height={700}
          />
          <UploadImage method="userScreen" userId={userId}>
            Обновить
          </UploadImage>
        </div>
        <div>
          <h1>Фото вашего профиля</h1>
          <Image
            className="w-full object-fill aspect-[3/2] rounded-3xl rounded-b-none"
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
    </>
  );
}
