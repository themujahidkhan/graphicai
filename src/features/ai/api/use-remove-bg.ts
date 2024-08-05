import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";

type ResponseType = InferResponseType<
	(typeof client.api.ai)["remove-bg"]["$post"]
>;
type RequestType = InferRequestType<
	(typeof client.api.ai)["remove-bg"]["$post"]
>["json"];

export const useRemoveBg = () => {
	const mutation = useMutation<ResponseType, Error, RequestType>({
		// @ts-ignore
		mutationFn: async (json) => {
			// @ts-ignore
			const response = await client.api.ai["remove-bg"].$post({ json });
			return await response.json();
		},
	});

	return mutation;
};
