import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.projects[":id"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.projects[":id"]["$patch"]>["json"];

export const useUpdateProject = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationKey: ["project", { id }],
    mutationFn: async (data) => {
      const response = await client.api.projects[":id"].$patch({ 
        json: {
          ...data,
          name: data.name?.trim() || "Untitled project"
        },
        param: { id },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update project");
      }

      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", { id }] });
      queryClient.setQueryData(["project", { id }], data);
      toast.success("Project saved successfully");
    },
    onError: (error) => {
      console.error("Update project error:", error);
      toast.error(error.message || "Failed to update project");
    }
  });

  return mutation;
};