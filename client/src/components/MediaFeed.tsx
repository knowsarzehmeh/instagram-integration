import { useState } from "react";
import { MessageCircle, Heart } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Comments } from "./Comments";
import { apiServices } from "@/utils/api";

interface MediaFeedProps {
  userId: string;
}

export function MediaFeed({ userId }: MediaFeedProps) {
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const { ref } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["media", userId],
    queryFn: ({ pageParam }) =>
      apiServices.fetchMedia(userId, Number(pageParam)),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.nextPage
        : undefined;
    },
  });

  const mediaItems = data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-64 bg-gray-200 rounded animate-pulse" />
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 p-4">
        <p className="font-semibold">Error loading media</p>
        <p className="text-sm mt-2">
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </p>
      </div>
    );
  }

  if (mediaItems.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">No media found</p>
      </div>
    );
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
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://placehold.co/500x500?text=Image+Not+Available";
                }}
              />
            )}
            {item.media_type === MediaType.VIDEO && (
              <video
                src={item.media_url}
                controls
                className="w-full h-auto rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLVideoElement;
                  target.poster =
                    "https://placehold.co/500x500?text=Video+Not+Available";
                }}
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
      <div ref={ref} className="h-10">
        {isFetchingNextPage && (
          <div className="text-center text-gray-500">Loading more...</div>
        )}
      </div>
    </div>
  );
}
