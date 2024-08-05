import type { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

type ResponseType = InferResponseType<(typeof client.api.users)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.users)["$post"]>["json"];

export const useSignUp = () => {
	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async (json) => {
			const response = await fetch("https://graphicai.design/api/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(json),
				credentials: "include",
			});
			if (!response.ok) {
				throw new Error("Something went wrong");
			}
			return await response.json();
		},
		onSuccess: () => {
			toast.success("User created");
		},
	});

	return mutation;
};
