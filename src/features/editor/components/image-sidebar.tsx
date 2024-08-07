import { ActiveTool, Editor } from "@/features/editor/types";
import { AlertTriangle, Loader, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { cn } from "@/lib/utils";
import { useGetImages } from "@/features/images/api/use-get-images";
import { useState } from "react";

interface ImageSidebarProps {
	editor: Editor | undefined;
	activeTool: ActiveTool;
	onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ImageSidebar = ({
	editor,
	activeTool,
	onChangeActiveTool,
}: ImageSidebarProps) => {
	const [searchTerm, setSearchTerm] = useState("");
	const { data, isLoading, isError, refetch } = useGetImages(searchTerm);

	const onClose = () => {
		onChangeActiveTool("select");
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		refetch();
	};

	return (
		<aside
			className={cn(
				"bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
				activeTool === "images" ? "visible" : "hidden",
			)}
		>
			<ToolSidebarHeader
				title="Images"
				description="Add images to your canvas"
			/>

			<form onSubmit={handleSearch} className="p-4 flex gap-2">
				<Input
					placeholder="Search images..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<Button type="submit">Search</Button>
			</form>

			{isLoading && (
				<div className="flex items-center justify-center flex-1">
					<Loader className="size-4 text-muted-foreground animate-spin" />
				</div>
			)}
			{isError && (
				<div className="flex flex-col gap-y-4 items-center justify-center flex-1">
					<AlertTriangle className="size-4 text-muted-foreground" />
					<p className="text-muted-foreground text-xs">
						Failed to fetch images
					</p>
				</div>
			)}
			<ScrollArea>
				<div className="p-4">
					<div className="grid grid-cols-2 gap-4">
						{data?.map((image) => {
							return (
								<button
									type="button"
									onClick={() => editor?.addImage(image.urls.regular)}
									key={image.id}
									className="relative w-full h-[100px] group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
								>
									<Image
										fill
										src={image.urls.small}
										alt={image.alt_description || "Image"}
										className="object-cover"
									/>
									<Link
										target="_blank"
										href={image.links.html}
										className="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50 text-left"
									>
										{image.user.name}
									</Link>
								</button>
							);
						})}
					</div>
				</div>
			</ScrollArea>
			<ToolSidebarClose onClick={onClose} />
		</aside>
	);
};