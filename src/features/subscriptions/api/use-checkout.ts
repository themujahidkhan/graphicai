export const useCheckout = () => {
	const mutation = useMutation<ResponseType, Error, { priceId: string }>({
		mutationFn: async ({ priceId }) => {
			if (!priceId) {
				throw new Error("Price ID is required");
			}
			console.log("Checkout priceId:", priceId); // Add this line
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
