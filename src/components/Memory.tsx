"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Edit2, Loader2, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Memory() {
  const { data: userData, isLoading, refetch } = api.user.getMemory.useQuery();
  const [isEditing, setIsEditing] = useState(false);
  const { data: userDetails } = api.user.getDetails.useQuery();
  const [details, setDetails] = useState("");

  const { mutateAsync: deleteMemory, isPending: isDeleting } =
    api.user.updateMemories.useMutation({
      onSuccess: () => {
        toast.success("Memory deleted");
        void utils.user.getMemory.invalidate();
      },
    });

  // Update details state when userDetails changes
  useEffect(() => {
    if (!isEditing) {
      setDetails(userDetails ?? "");
    }
  }, [userDetails, isEditing]);

  const utils = api.useUtils();

  const { mutateAsync: updateDetails, isPending: isUpdating } =
    api.user.updateDetails.useMutation({
      onSuccess: () => {
        setIsEditing(false);
        toast.success("Details saved");
        void utils.user.getDetails.invalidate();
      },
      onError: () => {
        toast.error("Failed to save details");
      },
    });

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Details Card */}
      <Card className="bg-gradient-to-br from-violet-500/5 via-card to-blue-500/5">
        <CardHeader>
          <CardTitle>About You</CardTitle>
          <CardDescription>
            Tell us about yourself to help personalize your experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <Textarea
                value={details === "null" || !details ? "" : details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Tell us about yourself..."
                className="min-h-[100px] resize-none bg-gradient-to-br from-violet-500/5 via-card to-blue-500/5"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setDetails(userDetails ?? "");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    void updateDetails({ details });
                  }}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <p className="min-h-[50px] whitespace-pre-wrap text-muted-foreground">
                {!userDetails || userDetails === "null" ? (
                  <span className="text-muted-foreground/50">
                    No details added yet
                  </span>
                ) : (
                  userDetails
                )}
              </p>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Details
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Memory list */}
      <div className="flex flex-col-reverse gap-2">
        {userData?.map((memory, index) => (
          <div
            key={index}
            className={cn(
              "group flex items-center gap-2 rounded-lg border p-4 transition-all",
              "bg-gradient-to-br from-violet-500/5 via-card to-blue-500/5",
              "hover:from-violet-500/10 hover:to-blue-500/10 hover:shadow-md",
            )}
          >
            <span className="flex-1 text-sm">{memory}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (userData) {
                  void deleteMemory({
                    memories: userData.filter((_, i) => i !== index),
                  });
                }
              }}
              className="h-8 w-8 opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
        ))}

        {userData?.length === 0 && (
          <div className="flex min-h-[100px] items-center justify-center rounded-lg border border-dashed bg-gradient-to-br from-violet-500/5 via-card to-blue-500/5">
            <p className="text-sm text-muted-foreground">
              No memories yet. Your memories will appear here as you journal.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
