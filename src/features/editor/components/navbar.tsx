"use client";

import { ActiveTool, Editor } from "@/features/editor/types";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	IconArrowBackUp,
	IconArrowForwardUp,
	IconChevronDown,
	IconClick,
	IconCloudCheck,
	IconCloudOff,
	IconDownload,
	IconFileTypeJpg,
	IconFileTypePng,
	IconFileTypeSvg,
	IconFolderOpen,
	IconJson,
	IconLoader,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { CiFileOn } from "react-icons/ci";
import { Hint } from "@/components/hint";
import { Input } from "@/components/ui/input";
import { Logo } from "@/features/editor/components/logo";
import { Separator } from "@/components/ui/separator";
import { UserButton } from "@/features/auth/components/user-button";
import { cn } from "@/lib/utils";
import { useFilePicker } from "use-file-picker";
import { useMutationState } from "@tanstack/react-query";
import { useUpdateProject } from "@/features/projects/api/use-update-project";

interface NavbarProps {
	id: string;
	editor: Editor | undefined;
	activeTool: ActiveTool;
	onChangeActiveTool: (tool: ActiveTool) => void;
	initialProjectName: string;
	onProjectNameChange: (newName: string) => void;
}

export const Navbar = ({
	id,
	editor,
	activeTool,
	onChangeActiveTool,
	initialProjectName,
}: NavbarProps) => {
	const [projectName, setProjectName] = useState(initialProjectName);
	const updateProjectMutation = useUpdateProject(id);

	useEffect(() => {
		const debounceTimer = setTimeout(() => {
			const newName = projectName?.trim() || "Untitled project";
			if (newName !== initialProjectName) {
				updateProjectMutation.mutate(
					{ name: newName },
					{
						onError: (error) => {
							console.error("Failed to update project name:", error);
							setProjectName(initialProjectName || "Untitled project");
						},
					},
				);
			}
		}, 3000);

		return () => clearTimeout(debounceTimer);
	}, [projectName, updateProjectMutation, initialProjectName]);

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setProjectName(e.target.value);
	};

	const handleNameBlur = () => {
		if (!projectName?.trim()) {
			setProjectName("Untitled project");
		}
	};

	const data = useMutationState({
		filters: {
			mutationKey: ["project", { id }],
			exact: true,
		},
		select: (mutation) => mutation.state.status,
	});

	const currentStatus = data[data.length - 1];

	const isError = currentStatus === "error";
	const isPending = currentStatus === "pending";

	const { openFilePicker } = useFilePicker({
		accept: ".json",
		onFilesSuccessfullySelected: ({ plainFiles }: any) => {
			if (plainFiles && plainFiles.length > 0) {
				const file = plainFiles[0];
				const reader = new FileReader();
				reader.readAsText(file, "UTF-8");
				reader.onload = () => {
					editor?.loadJson(reader.result as string);
				};
			}
		},
	});

	return (
		<nav className="w-full flex items-center p-4 h-[68px] gap-x-8 border-b lg:pl-[34px]">
			<div className="h-[68px] flex items-center px-4 min-w-fit">
				<Logo />
			</div>
			<div className="w-full flex items-center gap-x-1 h-full">
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<Button size="sm" variant="ghost">
							File
							<IconChevronDown className="size-4 ml-2" stroke={1} />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="min-w-60">
						<DropdownMenuItem
							onClick={() => openFilePicker()}
							className="flex items-center gap-x-2"
						>
							<IconFolderOpen className="size-8" stroke={1} />
							<div>
								<p>Open</p>
								<p className="text-xs text-muted-foreground">
									Open a JSON file
								</p>
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<Separator orientation="vertical" className="mx-2" />
				<Hint label="Select" side="bottom" sideOffset={10}>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => onChangeActiveTool("select")}
						className={cn(activeTool === "select" && "bg-gray-100")}
					>
						<IconClick size={24} stroke={1} />
					</Button>
				</Hint>
				<Hint label="Undo" side="bottom" sideOffset={10}>
					<Button
						disabled={!editor?.canUndo()}
						variant="ghost"
						size="icon"
						onClick={() => editor?.onUndo()}
					>
						<IconArrowBackUp size={24} stroke={1} />
					</Button>
				</Hint>
				<Hint label="Redo" side="bottom" sideOffset={10}>
					<Button
						disabled={!editor?.canRedo()}
						variant="ghost"
						size="icon"
						onClick={() => editor?.onRedo()}
					>
						<IconArrowForwardUp size={24} stroke={1} />
					</Button>
				</Hint>
				<Separator orientation="vertical" className="mx-2" />
				{isPending && (
					<div className="flex items-center gap-x-2">
						<IconLoader className="size-4 animate-spin text-muted-foreground" />
						<div className="text-xs text-muted-foreground">Saving...</div>
					</div>
				)}
				{!isPending && isError && (
					<div className="flex items-center gap-x-2">
						<IconCloudOff className="size-[20px] text-muted-foreground" />
						<div className="text-xs text-muted-foreground">Failed to save</div>
					</div>
				)}
				{!isPending && !isError && (
					<div className="flex items-center gap-x-2">
						<IconCloudCheck className="size-[20px] text-muted-foreground" />
						<div className="text-xs text-muted-foreground">Saved</div>
					</div>
				)}
				<div className="ml-auto flex items-center gap-x-4">
					<Input
						placeholder="Untitled project"
						value={projectName}
						onChange={handleNameChange}
						onBlur={handleNameBlur}
					/>
					<DropdownMenu modal={false}>
						<DropdownMenuTrigger asChild>
							<Button size="sm" variant="ghost">
								Export
								<IconDownload className="size-4 ml-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="min-w-60">
							<DropdownMenuItem
								className="flex items-center gap-x-2"
								onClick={() => editor?.saveJson()}
							>
								<IconJson className="size-8" stroke={1} />
								<div>
									<p>JSON</p>
									<p className="text-xs text-muted-foreground">
										Save for later editing
									</p>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem
								className="flex items-center gap-x-2"
								onClick={() => editor?.savePng()}
							>
								<IconFileTypePng className="size-8" stroke={1} />
								<div>
									<p>PNG</p>
									<p className="text-xs text-muted-foreground">
										Best for sharing on the web
									</p>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem
								className="flex items-center gap-x-2"
								onClick={() => editor?.saveJpg()}
							>
								<IconFileTypeJpg className="size-8" stroke={1} />
								<div>
									<p>JPG</p>
									<p className="text-xs text-muted-foreground">
										Best for printing
									</p>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem
								className="flex items-center gap-x-2"
								onClick={() => editor?.saveSvg()}
							>
								<IconFileTypeSvg className="size-8" stroke={1} />
								<div>
									<p>SVG</p>
									<p className="text-xs text-muted-foreground">
										Best for editing in vector software
									</p>
								</div>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<UserButton />
				</div>
			</div>
		</nav>
	);
};
