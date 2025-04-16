import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";
import { MediaFeed } from "@/components/MediaFeed";
import { useAuth } from "@/hooks/useAuth";

export function ProfilePage() {
  const { profile, isLoading, userId } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Profile not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={profile.profile_picture_url}
                alt={profile.username}
              />
              <AvatarFallback>
                {profile.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <CardTitle className="text-2xl">{profile.username}</CardTitle>
                <Button variant="outline" size="sm">
                  <Instagram className="w-4 h-4 mr-2" />
                  Follow
                </Button>
              </div>
              <div className="flex gap-6 mb-2">
                <div>
                  <span className="font-semibold">{profile.media_count}</span>{" "}
                  posts
                </div>
                <div>
                  <span className="font-semibold">
                    {profile.followers_count}
                  </span>{" "}
                  followers
                </div>
                <div>
                  <span className="font-semibold">
                    {profile.following_count}
                  </span>{" "}
                  following
                </div>
              </div>
              <div>
                <div className="font-semibold">{profile.name}</div>
                <div className="text-muted-foreground">{profile.bio}</div>
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {profile.website}
                  </a>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
        {userId && <MediaFeed userId={userId} />}
      </div>
    </div>
  );
}
