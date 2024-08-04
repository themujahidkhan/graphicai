import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

type ResponseType = { message: string };
type RequestType = { name: string; email: string; password: string };

export const useSignUp = () => {
	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async (json) => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/users`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(json),
					credentials: "include",
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Something went wrong");
			}

			return await response.json();
		},
		onSuccess: () => {
			toast.success("User created successfully");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return mutation;
};
