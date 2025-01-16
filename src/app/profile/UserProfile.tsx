"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import Tabs from "@/app/components/tabs";
import ResetPass from "@/app/components/Profile/resetPassword";
import UpdatePhoto from "@/app/components/Profile/updatePhoto";
import UpdateTech from "@/app/components/Profile/UpdateTech";
import Profile from "../components/Profile/profile";
import HistoryAlerts from "../components/Profile/alerts";
import { useEffect, useState } from "react";
import UpdateTGRef from "../components/Profile/updateTG";
type AlertProps = {
  type: string;
  message: string;
};
export default function UserProfile() {
  const { data: session, status } = useSession();

  const [alerts, setAlerts] = useState<AlertProps[]>([]);

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

  const tabContents = [
    <Profile
      session={session}
      status={status}
      alerts_array={alerts}
      key={0}
    />,
    <HistoryAlerts alerts_array={alerts} key={1} />,
    <UpdatePhoto
      userId={session!.user.id}
      username={session!.user.username!.toString()}
      key={2}
    />,
    <UpdateTGRef tgref={session!.user.tgref} id={session!.user.id} key={3} />,
    <UpdateTech nation={session!.user.nation} army={session!.user.army} id={session!.user.id} key={4} />,
    <ResetPass key={5} />,
  ];
  return (
    <Tabs
      tabs={[
        "Профиль",
        "Уведомления",
        "Обновить фото",
        "Контакты",
        "Сменить технику",
        "Сменить пароль",
      ]}
      tabContents={tabContents}
    />
  );
}

