import { ActiveTool, Editor } from "@/features/editor/types";
import { Loader, Trash2, Upload } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface UploadSidebarProps {
	editor: Editor | undefined;
	activeTool: ActiveTool;
	onChangeActiveTool: (tool: ActiveTool) => void;
}

export const UploadSidebar = ({
	editor,
	activeTool,
	onChangeActiveTool,
}: UploadSidebarProps) => {
	const { data: session } = useSession();
	const queryClient = useQueryClient();
	const [addingImageId, setAddingImageId] = useState<string | null>(null);

	const { data: uploadedImages, isLoading } = useQuery({
		queryKey: ["userUploads", session?.user?.id],
		queryFn: async () => {
			const response = await fetch(`/api/uploads?userId=${session?.user?.id}`);
			if (!response.ok) {
				throw new Error("Failed to fetch user uploads");
			}
			return response.json();
		},
		enabled: !!session?.user?.id,
	});

	const deleteImageMutation = useMutation({
		mutationFn: async (imageId: string) => {
			const response = await fetch(`/api/uploads/${imageId}`, {
				method: "DELETE",
			});
			if (!response.ok) {
				throw new Error("Failed to delete image");
			}
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries(["userUploads", session?.user?.id]);
		},
	});

	const onClose = () => {
		onChangeActiveTool("select");
	};

	const handleAddToCanvas = (imageUrl: string, imageId: string) => {
		if (editor) {
			setAddingImageId(imageId);
			editor.addImage(imageUrl);

			setTimeout(() => {
				setAddingImageId(null);
			}, 500); // 500ms delay, adjust as needed
		}
	};

	const handleDelete = (imageId: string) => {
		deleteImageMutation.mutate(imageId);
	};

	return (
		<aside
			className={cn(
				"bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
				activeTool === "upload" ? "visible" : "hidden",
			)}
		>
			<ToolSidebarHeader
				title="Upload"
				description="Upload and manage your images"
			/>
			<div className="p-4 border-b">
				<UploadButton
					appearance={{
						button: "w-full text-sm font-medium",
						allowedContent: "hidden",
					}}
					content={{
						button: "Upload Image",
					}}
					endpoint="imageUploader"
					onClientUploadComplete={(res) => {
						if (res && res[0]) {
							editor?.addImage(res[0].url);
							queryClient.invalidateQueries(["userUploads", session?.user?.id]);
						}
					}}
				/>
			</div>
			<ScrollArea>
				<div className="p-4">
					<div className="grid grid-cols-2 gap-4">
						{isLoading ? (
							<div>Loading...</div>
						) : (
							uploadedImages?.map((image: any) => (
								<div key={image.id} className="relative group">
									<div
										className="cursor-pointer relative"
										onClick={() => handleAddToCanvas(image.url, image.id)}
									>
										<Image
											src={image.url}
											alt={`Uploaded image ${image.id}`}
											width={150}
											height={150}
											className={cn(
												"object-cover rounded-md",
												addingImageId === image.id && "opacity-50",
											)}
										/>
										<div
											className={cn(
												"absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
												addingImageId === image.id && "opacity-100",
											)}
										>
											{addingImageId === image.id ? (
												<Loader className="h-6 w-6 text-white animate-spin" />
											) : (
												<Upload className="h-6 w-6 text-white" />
											)}
										</div>
									</div>
									<Button
										variant="destructive"
										size="icon"
										className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
										onClick={() => handleDelete(image.id)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							))
						)}
					</div>
				</div>
			</ScrollArea>
			<ToolSidebarClose onClick={onClose} />
		</aside>
	);
};
