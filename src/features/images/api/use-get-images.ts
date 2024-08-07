import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetImages = (searchTerm: string = "") => {
	const query = useQuery({
		queryKey: ["images", searchTerm],
		queryFn: async () => {
			const response = await client.api.images.$get({
				query: { search: searchTerm },
			});

			if (!response.ok) {
				throw new Error("Failed to fetch images");
			}

			const { data } = await response.json();
			return data;
		},
	});

	return query;
};
