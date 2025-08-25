// app/profile/settings/page.tsx
'use client';

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Tabs from "@/components/tabs";
import ResetPass from "@/components/Profile/resetPassword";
import UpdatePhoto from "@/components/Profile/updatePhoto";
import UpdateTech from "@/components/Profile/UpdateTech";
import Profile from "@/components/Profile/profile";
import HistoryAlerts from "@/components/Profile/alerts";
import { useEffect, useState } from "react";
import UpdateTGRef from "@/components/Profile/updateTG";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [alerts, setAlerts] = useState<{ type: string; message: string }[]>([]);

  if (status === "unauthenticated") {
    redirect('/signin');
  }

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `/api/alerts/${session?.user?.id || ""}`,
          {
            method: "GET",
          }
        );
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

  if (!session || !session.user) {
    return <div>Session not found</div>;
  }

  const tabContents = [
    <Profile session={session} status={status} alerts_array={alerts} key={0} />,
    <HistoryAlerts alerts_array={alerts} key={1} />,
    <UpdatePhoto
      userId={session.user.id!}
      username={session.user.username!}
      key={2}
    />,
    <UpdateTGRef tgref={session.user.tgref} id={session.user.id!} key={3} />,
    <UpdateTech
      nation={session.user.nation}
      army={session.user.army}
      id={session.user.id!}
      key={4}
    />,
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