"use client";

import { Button } from "@/components/ui/button";
import { useCreateProject } from "@/features/projects/api/use-create-project";
import { useRouter } from "next/navigation";

export const Banner = () => {
	const router = useRouter();
	const mutation = useCreateProject();

	// @ts-ignore
	const handleSelect = (type) => {
		createProject(type);
	};

	// @ts-ignore
	const createProject = (type) => {
		mutation.mutate(
			{
				name: `Untitled ${type.label}`,
				json: "",
				width: type.width,
				height: type.height,
			},
			{
				onSuccess: ({ data }) => {
					router.push(`/editor/${data.id}`);
				},
			},
		);
	};

	const createBlankProject = () => {
		mutation.mutate(
			{
				name: "Untitled Project",
				json: "",
				width: 1080,
				height: 1080,
			},
			{
				onSuccess: ({ data }) => {
					router.push(`/editor/${data.id}`);
				},
			},
		);
	};

	return (
		<div className="text-black aspect-[5/1] min-h-[248px] flex flex-col p-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-100 relative">

			<div className="flex flex-col gap-y-4 items-center justify-center flex-grow">
				<h2 className="text-xl md:text-3xl font-semibold text-center">
					Bring your creative vision to life with AI-powered graphics
				</h2>
				<p className="text-xs md:text-sm text-center">
					Build your online presence with AI Graphic Design
				</p>
				<Button onClick={createBlankProject} variant="secondary">
					Start Blank
				</Button>
				{mutation.isPending && (
					<p className="text-sm text-muted-foreground">
						Creating your project...
					</p>
				)}
			</div>
		</div>
	);
};
