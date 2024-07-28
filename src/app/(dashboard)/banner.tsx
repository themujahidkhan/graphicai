"use client";

import { ArrowRight, Sparkles } from "lucide-react";

import { Autocomplete } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import { useCreateProject } from "@/features/projects/api/use-create-project";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Banner = () => {
	const router = useRouter();
	const mutation = useCreateProject();

	const handleSelect = (type) => {
		createProject(type);
	};

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
				name: "Untitled Blank Project",
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
		<div className="text-black aspect-[5/1] min-h-[248px] flex flex-col p-6 rounded-xl bg-gradient-to-r from-[#b1f643] to-[#fbfbfb] relative">
			<div className="absolute top-4 right-4"></div>
			<div className="flex flex-col gap-y-4 items-center justify-center flex-grow">
				<h1 className="text-xl md:text-3xl font-semibold text-center">
					Bring your creative vision to life with AI-powered graphics
				</h1>
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
