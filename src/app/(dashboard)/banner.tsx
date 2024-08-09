"use client";

import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import { useCreateProject } from "@/features/projects/api/use-create-project";
import { useRouter } from "next/navigation";

export const Banner = () => {
	const router = useRouter();
	const mutation = useCreateProject();

	const onClick = () => {
		mutation.mutate(
			// @ts-ignore
			{
				name: "Untitled project",
				json: "",
				width: 900,
				height: 1200,
			},
			{
				onSuccess: ({ data }) => {
					// @ts-ignore
					router.push(`/editor/${data.id}`);
				},
			},
		);
	};

	return (
		<div className="text-black aspect-[5/1] min-h-[248px] flex gap-x-6 p-6 items-center rounded-md bg-yellow-300">

			<div className="flex flex-col gap-y-2 items-center justify-center w-full text-center">
				<h2 className="text-xl md:text-3xl font-semibold">
					Visualize your ideas with Graphic AI
				</h2>
				<p className="text-xs md:text-sm mb-2">
					Build your online presence with AI Graphic Design
				</p>
				<Button
					disabled={mutation.isPending}
					onClick={onClick}
					variant="secondary"
					className="min-w-fit bg-black text-white hover:bg-white hover:text-black transition-all duration-700 text-md"
				>
					Start creating
					<IconArrowRight className=" ml-2" size={22} strokeWidth={1.5} />
				</Button>
			</div>
		</div>
	);
};