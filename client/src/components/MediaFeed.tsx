import { MessageCircle, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiServices } from "@/utils/api";
import { MediaItem } from "@/utils/types";

interface MediaFeedProps {
  userId: string;
}

export function MediaFeed({ userId }: MediaFeedProps) {
  const {
    data: media,
    isLoading,
    isError,
    error,
  } = useQuery<MediaItem[], Error>({
    queryKey: ["media", userId],
    queryFn: () => apiServices.fetchMedia(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return <div className="text-center">Loading media...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  if (!media || media.length === 0) {
    return <div className="text-center">No media found</div>;
  }

  const MediaType = {
    IMAGE: "IMAGE",
    VIDEO: "VIDEO",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {media.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              {new Date(item.timestamp).toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {item.media_type === MediaType.IMAGE && (
              <img
                src={item.media_url}
                alt={item.caption || "Instagram post"}
                className="w-full h-auto rounded-lg"
              />
            )}
            {item.media_type === MediaType.VIDEO && (
              <video
                src={item.media_url}
                controls
                className="w-full h-auto rounded-lg"
              />
            )}
            {item.caption && <p className="mt-2 text-sm">{item.caption}</p>}
            <div className="flex items-center gap-4 mt-2">
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                {item.like_count}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                {item.comments_count}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
