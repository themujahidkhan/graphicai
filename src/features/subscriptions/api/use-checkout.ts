import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

type ResponseType = InferResponseType<
	(typeof client.api.subscriptions.checkout)["$post"],
	200
>;

export const useCheckout = () => {
	const mutation = useMutation<ResponseType, Error, { priceId: string }>({
		mutationFn: async ({ priceId }) => {
			if (!priceId) {
				throw new Error("Price ID is required");
			}
			const response = await client.api.subscriptions.checkout.$post({
				json: { priceId },
			});

			if (!response.ok) {
				throw new Error("Failed to create session");
			}

			return await response.json();
		},
		onSuccess: ({ data }) => {
			window.location.href = data;
		},
		onError: (error) => {
			console.error("Checkout error:", error);
			toast.error("Failed to create session. Please try again.");
		},
	});

	return mutation;
};
