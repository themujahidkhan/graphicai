"use client";

import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
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
		<div className="text-black aspect-[5/1] min-h-[248px] flex gap-x-6 p-6 items-center rounded-xl bg-gradient-to-r from-[#e1ff00] to-[#fbfbfb]">
			<div className="rounded-full size-28 items-center justify-center bg-white/50 hidden md:flex">
				<div className="rounded-full size-20 flex items-center justify-center bg-white">
					<Sparkles className="h-20 text-[#0073ff] fill-[#0073ff]" />
				</div>
			</div>
			<div className="flex flex-col gap-y-2">
				<h1 className="text-xl md:text-3xl font-semibold">
					Visualize your ideas with Graphic AI
				</h1>
				<p className="text-xs md:text-sm mb-2">
					Build your online presence with AI Graphic Design
				</p>
				<Button
					disabled={mutation.isPending}
					onClick={onClick}
					variant="secondary"
					className="w-[160px]"
				>
					Start creating
					<ArrowRight className="size-4 ml-2" />
				</Button>
			</div>
		</div>
	);
};