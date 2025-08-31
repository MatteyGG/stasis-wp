import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

interface Viewer {
    id: string;
    username: string;
    userId: string;
    viewedAt: Date;
    user?: {
        gameID?: string;
    };
}

interface RecentViewersProps {
    viewers: Viewer[];
}

export function RecentViewers({ viewers }: RecentViewersProps) {
    if (!viewers || viewers.length === 0) return null;


    return (
        <div className="mt-8 pt-4 border-t">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Недавно просматривали
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
                {viewers.map((viewer) => {
                    const avatarImage = `https://s3.timeweb.cloud/576b093c-bf65d329-1603-4121-b476-e46d7ce3cb2a/userProfile/${viewer.userId}.png`;

                    return (
                        <div key={viewer.id} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                            <Avatar className="h-8 w-8">
                                <Image
                                    className="rounded-full object-cover border-2 border-gray-300"
                                    src={avatarImage}
                                    alt={viewer.username}
                                    width={128}
                                    height={128}
                                />
                            </Avatar>
                            <div className="text-sm">
                                <span className="font-medium">{viewer.username}</span>
                                {viewer.user?.gameID && (
                                    <span className="text-xs text-muted-foreground ml-1">
                                        ({viewer.user.gameID})
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}