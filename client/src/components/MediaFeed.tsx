import { useState } from "react";
import { MessageCircle, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Comments } from "./Comments";
import { apiServices } from "@/utils/api";
import { MediaItem } from "@/utils/types";

interface MediaFeedProps {
  userId: string;
}

export function MediaFeed({ userId }: MediaFeedProps) {
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);

  const { data: mediaItems = [], isLoading } = useQuery<MediaItem[]>({
    queryKey: ["media", userId],
    queryFn: () => apiServices.fetchMedia(userId),
  });

  if (isLoading) {
    return <div className="text-center">Loading media...</div>;
  }

  const MediaType = {
    IMAGE: "IMAGE",
    VIDEO: "VIDEO",
  };

  return (
    <div className="space-y-4">
      {mediaItems.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              {new Date(item.timestamp).toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setSelectedMediaId(
                    selectedMediaId === item.id ? null : item.id
                  )
                }
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {item.comments_count}
              </Button>
            </div>
            {selectedMediaId === item.id && (
              <div className="mt-4">
                <Comments mediaId={item.id} userId={userId} />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
