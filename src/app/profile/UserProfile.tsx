"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import ResetPass from "@/components/Profile/resetPassword";
import UpdatePhoto from "@/components/Profile/updatePhoto";
import UpdateTech from "@/components/Profile/UpdateTech";
import Profile from "../../components/Profile/profile";
import HistoryAlerts from "../../components/Profile/alerts";
import { useEffect, useState } from "react";
import UpdateTGRef from "../../components/Profile/updateTG";
import PublicProfile from "../../components/Profile/PublicProfile";

import "react-toastify/dist/ReactToastify.css";
import { Sidebar } from "@/components/NewUi/sidebar";
import { useParams, usePathname } from "next/navigation";

type AlertProps = {
  type: string;
  message: string;
};

// Определяем тип для секций профиля
type ProfileSection = 
  | "profile" 
  | "notifications" 
  | "photo" 
  | "contacts" 
  | "tech" 
  | "password";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const params = useParams();
  const pathname = usePathname();
  
  const [alerts, setAlerts] = useState<AlertProps[]>([]);
  const [currentSection, setCurrentSection] = useState<ProfileSection>("profile");

  if (status === "unauthenticated") {
    redirect("/singin");
  }

  // Определяем текущую секцию из URL
  useEffect(() => {
    const pathParts = pathname.split('/');
    if (pathParts.length > 3) {
      const section = pathParts[3] as ProfileSection;
      setCurrentSection(section);
    }
  }, [pathname]);

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

  // Проверяем, является ли текущий пользователь владельцем профиля
  const isOwnProfile = session.user.id === params.userId;

  // Функция для отображения контента в зависимости от выбранной секции
  const renderContent = () => {
    if (!isOwnProfile) {
      return <PublicProfile userData={session.user} />;
    }

    switch (currentSection) {
      case "profile":
        return <Profile session={session} status={status} alerts_array={alerts} />;
      case "notifications":
        return <HistoryAlerts alerts_array={alerts} />;
      case "photo":
        return <UpdatePhoto userId={session.user.id!} username={session.user.username!} />;
      case "contacts":
        return <UpdateTGRef tgref={session.user.tgref} id={session.user.id!} />;
      case "tech":
        return <UpdateTech nation={session.user.nation} army={session.user.army} id={session.user.id!} />;
      case "password":
        return <ResetPass />;
      default:
        return <Profile session={session} status={status} alerts_array={alerts} />;
    }
  };

  return (
    <div className="flex">
      {isOwnProfile && (
        <Sidebar 
          current={currentSection} 
          onChange={(section) => setCurrentSection(section as ProfileSection)} 
        />
      )}
      <div className="flex-1 p-4">
        {renderContent()}
      </div>
    </div>
  );
}