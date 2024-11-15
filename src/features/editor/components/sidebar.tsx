"use client";

import {
	IconLayoutDashboard,
	IconLayoutGrid,
	IconPencil,
	IconPhoto,
	IconSettings,
	IconTypography,
	IconUpload,
	IconWand,
} from "@tabler/icons-react";

import { ActiveTool } from "@/features/editor/types";
import { SidebarItem } from "@/features/editor/components/sidebar-item";

interface SidebarProps {
	activeTool: ActiveTool;
	onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Sidebar = ({ activeTool, onChangeActiveTool }: SidebarProps) => {
	return (
		<aside className="bg-white flex flex-col w-[100px] h-full border-r overflow-y-auto">
			<ul className="flex flex-col">
				<SidebarItem
					icon={IconLayoutDashboard}
					label="Templates"
					isActive={activeTool === "templates"}
					onClick={() => onChangeActiveTool("templates")}
				/>
				<SidebarItem
					icon={IconLayoutGrid}
					label="Elements"
					isActive={activeTool === "elements"}
					onClick={() => onChangeActiveTool("elements")}
				/>
				<SidebarItem
					icon={IconTypography}
					label="Text"
					isActive={activeTool === "text"}
					onClick={() => onChangeActiveTool("text")}
				/>
				<SidebarItem
					icon={IconPhoto}
					label="Image"
					isActive={activeTool === "images"}
					onClick={() => onChangeActiveTool("images")}
				/>
				<SidebarItem
					icon={IconUpload}
					label="Upload"
					isActive={activeTool === "upload"}
					onClick={() => onChangeActiveTool("upload")}
				/>

				<SidebarItem
					icon={IconPencil}
					label="Draw"
					isActive={activeTool === "draw"}
					onClick={() => onChangeActiveTool("draw")}
				/>
				<SidebarItem
					icon={IconWand}
					label="AI"
					isActive={activeTool === "ai"}
					onClick={() => onChangeActiveTool("ai")}
				/>
				<SidebarItem
					icon={IconSettings}
					label="Settings"
					isActive={activeTool === "settings"}
					onClick={() => onChangeActiveTool("settings")}
				/>
			</ul>
		</aside>
	);
};
