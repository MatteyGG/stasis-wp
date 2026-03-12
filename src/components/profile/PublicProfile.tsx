// components/Profile/PublicProfile.tsx
import Image from 'next/image';

interface PublicProfileProps {
  userData: {
    id: string;
    username: string;
    army: string;
    nation: string;
    rank: string;
    tgref: string;
    created_at: string;
    approved: boolean;
  };
}

export default function PublicProfile({ userData }: PublicProfileProps) {
  return (
    <div className="container w-full bg-gray-200 bg-opacity-55 p-4 shadow-2xl shadow-black mx-auto rounded-3xl">
      <div className="grid md:grid-cols-2 gap-2">
        <div className="z-2 relative w-full justify-center">
          <div className="mx-auto w-10/12 place-items-center">
            <Image
              className="z-20 object-none aspect-[3/2] rounded-3xl"
              src={`https://s3.timeweb.cloud/576b093c-bf65d329-1603-4121-b476-e46d7ce3cb2a/userScreen/${userData.id}.png`}
              alt={userData.username}
              width={700}
              height={700}
              onError={(e) => {
                e.currentTarget.src = "/noimage.png";
              }}
            />
          </div>
          <div className="mt-4 items-center pb-1">
            <div className="text-xl w-10/12 justify-center mx-auto">
              <div className="flex flex-col">
                <div className={`${userData.rank} flex flex-row justify-between text-nowrap text-xl p-3 font-semibold rounded-md`}>
                  <div>
                    <span className="uppercase">{userData.rank}</span>:
                    <span className="capitalize">{userData.username}</span>
                  </div>
                  <Image
                    src={`/source/${userData.approved ? 'verified' : 'unverified'}.svg`}
                    height={24}
                    width={24}
                    alt=""
                  />
                </div>
                <p className="text-gray-500">
                  {new Date(userData.created_at).toLocaleDateString("ru-RU")}
                </p>
                <div className="inline-flex pt-1">
                  <Image
                    src={"/source/nation/" + userData.nation + ".webp"}
                    height={64}
                    width={64}
                    alt=""
                  />
                  <Image
                    src={"/source/army/" + userData.army + ".webp"}
                    height={64}
                    width={64}
                    alt=""
                  />
                </div>
              </div>
              <div className="mt-2 mb-2">
                <h1>Контакты</h1>
                <a className="w-full" href={`https://t.me/${userData.tgref}`} target="_blank">
                  <Image
                    src="/source/icon/telegram.png"
                    height={64}
                    width={64}
                    alt="Telegram"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div>
          {/* Добавьте публичную информацию о пользователе */}
          <h2>Статистика игрока</h2>
          {/* ... */}
        </div>
      </div>
    </div>
  );
}