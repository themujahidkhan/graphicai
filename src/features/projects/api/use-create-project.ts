import type { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";
import { useAnalytics } from "@/hooks/useAnalytics";

type ResponseType = InferResponseType<
	(typeof client.api.projects)["$post"],
	200
>;
type RequestType = InferRequestType<
	(typeof client.api.projects)["$post"]
>["json"];

export const useCreateProject = () => {
	const queryClient = useQueryClient();
	const { trackEvent } = useAnalytics();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async (json) => {
			const response = await client.api.projects.$post({
				json: {
					...json,
					name: json.name || "Untitled project",
				},
			});

			if (!response.ok) {
				const errorData = await response.json();
				// @ts-ignore
				throw new Error(errorData.error || "Failed to create project");
			}

			return await response.json();
		},
		onSuccess: (data, variables) => {
			toast.success("Project created successfully");
			queryClient.invalidateQueries({ queryKey: ["projects"] });
			trackEvent("create_project", "Project", data.data.name);
		},
		onError: (error) => {
			console.error("Can't create project:", error);
			toast.error(error.message || "Failed to create project");
			trackEvent("create_project_error", "Project", error.message);
		},
	});

	return mutation;
};
