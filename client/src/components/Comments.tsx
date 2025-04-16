import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Comment } from "./Comment";
import { apiServices } from "@/utils/api";

interface CommentType {
  id: string;
  text: string;
  username: string;
  timestamp: string;
  replies?: CommentType[];
}

interface CommentsProps {
  mediaId: string;
  userId: string;
}

export function Comments({ mediaId, userId }: CommentsProps) {
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery<CommentType[]>({
    queryKey: ["comments", mediaId, userId],
    queryFn: () => apiServices.fetchComments(mediaId, userId),
  });

  const addCommentMutation = useMutation({
    mutationFn: (message: string) =>
      apiServices.replyToComment(mediaId, "new", userId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", mediaId, userId],
      });
      setNewComment("");
    },
  });

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addCommentMutation.mutate(newComment);
  };

  if (isLoading) {
    return <div className="text-center">Loading comments...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleAddComment}
            disabled={!newComment.trim() || addCommentMutation.isPending}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {comments.map((comment: CommentType) => (
            <Comment
              key={comment.id}
              comment={comment}
              mediaId={mediaId}
              userId={userId}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
