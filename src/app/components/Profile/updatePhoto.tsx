import Image from "next/image";
import UploadImage from "../userImageUpload";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function UpdatePhoto({
  username,
  userId,
}: {
  username: string;
  userId: string;
}) {
  return (
    <>
      <div className="mx-2 md:mx-12 grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="h-full">
          <h1>Фото вашей техники</h1>
          <div>
            <Image
              className="w-full border-8 border-b-0  shadow-2xl shadow-black object-fill aspect-[3/2] rounded-3xl rounded-b-none"
              src={
                "https://s3.timeweb.cloud/576b093c-bf65d329-1603-4121-b476-e46d7ce3cb2a/userScreen/" +
                userId +
                ".png"
              }
              alt={username}
              width={700}
              height={700}
            />
            <UploadImage
              method="userScreen"
              userId={userId}
              onUploadComplete={() => {
                toast.success("Картинка загружена!");
              }}
            >
              Обновить
            </UploadImage>
            <Image
              className="w-full shadow-2xl border-8 border-t-0  shadow-black object-fill aspect-[3/2] rounded-3xl rounded-t-none"
              src={"/source/help/army.png"}
              alt={username}
              width={700}
              height={700}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onError={(event: any) => {
                event.target.id = "/noimage.png";
                event.target.srcset = "/noimage.png";
              }}
            />
          </div>
        </div>
        <div className="h-full">
          <h1>Фото вашего профиля</h1>
          <div>
            <Image
              className="w-full shadow-2xl border-8 border-b-0 shadow-black object-fill aspect-[3/2] rounded-3xl rounded-b-none"
              src={
                "https://s3.timeweb.cloud/576b093c-bf65d329-1603-4121-b476-e46d7ce3cb2a/userProfile/" +
                userId +
                ".png"
              }
              alt={username}
              width={700}
              height={700}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onError={(event: any) => {
                event.target.id = "/noimage.png";
                event.target.srcset = "/noimage.png";
              }}
            />
            <UploadImage
              method="userProfile"
              userId={userId}
              onUploadComplete={() => {
                toast.success("Картинка загружена!");
              }}
            >
              Обновить
            </UploadImage>
            <Image
              className="w-full shadow-2xl border-8 border-t-0  shadow-black object-fill aspect-[3/2] rounded-3xl rounded-t-none"
              src={"/source/help/profile.png"}
              alt={username}
              width={700}
              height={700}
            />
          </div>
        </div>
      </div>
      <ToastContainer
      position="bottom-center" 
      />
    </>
  );
}

