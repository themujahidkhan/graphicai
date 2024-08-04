import { ActiveTool, Editor } from "@/features/editor/types";

import { ElementCategory } from "@/features/editor/components/ElementCategory";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShapesCategory } from "@/features/editor/components/ElementsCategory/ShapesCateogry";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ElementsSidebarProps {
	editor: Editor | undefined;
	activeTool: ActiveTool;
	onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ElementsSidebar = ({
	editor,
	activeTool,
	onChangeActiveTool,
}: ElementsSidebarProps) => {
	const [searchQuery, setSearchQuery] = useState("");

	const onClose = () => {
		onChangeActiveTool("select");
	};

	// const categories = [
	// 	"Images",
	// 	"Graphics",
	// 	"Stickers",
	// 	"Frames",
	// 	"Grids",
	// 	"Mockups",
	// ];

	return (
		<aside
			className={cn(
				"bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
				activeTool === "elements" ? "visible" : "hidden",
			)}
		>
			<ToolSidebarHeader
				title="Elements"
				description="Add elements to your canvas"
			/>
			<div className="p-4">
				<Input
					placeholder="Search elements..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>
			<ScrollArea>
				<div className="p-4 space-y-6">
					<ShapesCategory editor={editor} searchQuery={searchQuery} />
					{/* {categories.map((category) => (
						<ElementCategory
							key={category}
							title={category}
							editor={editor}
							searchQuery={searchQuery}
						/>
					))} */}
				</div>
			</ScrollArea>
			<ToolSidebarClose onClick={onClose} />
		</aside>
	);
};
