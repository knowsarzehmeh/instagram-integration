import { useMutation } from "@tanstack/react-query";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiServices } from "@/utils/api";

export function LoginPage() {
  const handleInstagramLogin = () => {
    loginMutation.mutate();
  };

  const loginMutation = useMutation({
    mutationFn: apiServices.login,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error) => {
      console.error("Error initiating Instagram login:", error);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
          <CardDescription>
            Connect your Instagram account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleInstagramLogin}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white border-none"
          >
            <Instagram className="w-5 h-5 text-white" />
            Login with Instagram
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
