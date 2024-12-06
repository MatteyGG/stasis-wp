"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import Tabs from "@/app/components/tabs";
import ResetPass from "@/app/components/Profile/resetPassword";
import UpdatePhoto from "@/app/components/Profile/updatePhoto";
import UpdateTech from "@/app/components/Profile/UpdateTech";
import UpdateNickname from "@/app/components/Profile/updateNick";
import Profile from "../components/Profile/profile";
import HistoryAlerts from "../components/Profile/alerts";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const { data: session, status } = useSession();

  const [alerts, setAlerts] = useState<{ type: string; message: string }[]>([]);

  if (status === "unauthenticated") {
    redirect("/singin");
  }

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`/api/alerts/${session?.user.id}`, {
          method: "GET",
        });
        if (response) {
          const data = await response.json();
          setAlerts(data);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [session]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }



  const alerts_array = alerts;
  const tabContents = [
    <Profile session={session} status={status} alerts_array={alerts_array} key={0} />,
    <HistoryAlerts alerts_array={alerts_array} key={1} />,
    <UpdateNickname nickname={session!.user.username!.toString()} key={2} />,
    <UpdatePhoto userId={session!.user.id} username={session!.user.username!.toString()} key={3} />,
    <UpdateTech key={4} />,
    <ResetPass key={5} />,
  ];
  return (
    <Tabs
      tabs={[
        "Профиль",
        "Уведомления",
        "Обновить никнейм",
        "Обновить фото",
        "Сменить технику",
        "Сменить пароль",
      ]}
      tabContents={tabContents}
    />
  );
}


