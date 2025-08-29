// components/settings/UpdatePhoto.tsx
'use client';

import ImageWithFallback from '@/components/ImageWithFallback';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UploadImage from '../userImageUpload';

export default function UpdatePhoto({ username, userId }: { username: string; userId: string; }) {
  const userProfileImage = `https://s3.timeweb.cloud/576b093c-bf65d329-1603-4121-b476-e46d7ce3cb2a/userProfile/${userId}.png`;
  const userScreenImage = `https://s3.timeweb.cloud/576b093c-bf65d329-1603-4121-b476-e46d7ce3cb2a/userScreen/${userId}.png`;
  const fallbackProfile = "/source/help/profile.png";
  const fallbackScreen = "/source/help/army.png";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Фото техники</CardTitle>
          <CardDescription>Изображение вашей техники в игре</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <ImageWithFallback
              className="w-full object-cover aspect-video"
              src={userScreenImage}
              fallbackSrc={fallbackScreen}
              alt={username}
              width={400}
              height={250}
            />
          </div>
          <UploadImage
            method="userScreen"
            userId={userId}
            onUploadComplete={() => {
              // Принудительно обновляем страницу после загрузки
              window.location.reload();
            }}
            className="w-full"
          >
            Обновить фото техники
          </UploadImage>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Фото профиля</CardTitle>
          <CardDescription>Ваше основное изображение профиля</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <ImageWithFallback
              className="w-full object-cover aspect-square"
              src={userProfileImage}
              fallbackSrc={fallbackProfile}
              alt={username}
              width={250}
              height={250}
            />
          </div>
          <UploadImage
            method="userProfile"
            userId={userId}
            onUploadComplete={() => {
              window.location.reload();
            }}
            className="w-full"
          >
            Обновить фото профиля
          </UploadImage>
        </CardContent>
      </Card>
    </div>
  );
}