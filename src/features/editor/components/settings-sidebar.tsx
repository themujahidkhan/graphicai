"use client";

import { ActiveTool, Editor } from "@/features/editor/types";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/features/editor/components/color-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PRESET_SIZES } from "@/features/editor/constants/preset-sizes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { cn } from "@/lib/utils";

interface SettingsSidebarProps {
	editor: Editor | undefined;
	activeTool: ActiveTool;
	onChangeActiveTool: (tool: ActiveTool) => void;
}

export const SettingsSidebar = ({
	editor,
	activeTool,
	onChangeActiveTool,
}: SettingsSidebarProps) => {
	const workspace = editor?.getWorkspace();

	const [selectedPreset, setSelectedPreset] = useState("Custom");
	const initialWidth = useMemo(() => `${workspace?.width ?? 0}`, [workspace]);
	const initialHeight = useMemo(() => `${workspace?.height ?? 0}`, [workspace]);
	const initialBackground = useMemo(
		() => workspace?.fill ?? "#ffffff",
		[workspace],
	);

	const [width, setWidth] = useState(initialWidth);
	const [height, setHeight] = useState(initialHeight);
	const [background, setBackground] = useState(initialBackground);

	useEffect(() => {
		setWidth(initialWidth);
		setHeight(initialHeight);
		setBackground(initialBackground);
	}, [initialWidth, initialHeight, initialBackground]);

	const changeWidth = (value: string) => setWidth(value);
	const changeHeight = (value: string) => setHeight(value);
	const changeBackground = (value: string) => {
		setBackground(value);
		editor?.changeBackground(value);
	};

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const newWidth = Number.parseInt(width, 10);
		const newHeight = Number.parseInt(height, 10);
		editor?.changeSize({ width: newWidth, height: newHeight });
		setSelectedPreset("Custom");
	};

	const onPresetChange = (value: string) => {
		setSelectedPreset(value);
		const preset = PRESET_SIZES.find((size) => size.name === value);
		if (preset) {
			setWidth(preset.width.toString());
			setHeight(preset.height.toString());
			if (preset.width > 0 && preset.height > 0) {
				editor?.changeSize({ width: preset.width, height: preset.height });
			}
		}
	};

	const onClose = () => {
		onChangeActiveTool("select");
	};

	return (
		<aside
			className={cn(
				"bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
				activeTool === "settings" ? "visible" : "hidden",
			)}
		>
			<ToolSidebarHeader
				title="Settings"
				description="Change the look of your workspace"
			/>
			<ScrollArea>
				<form className="space-y-4 p-4" onSubmit={onSubmit}>
					<div className="space-y-2">
						<Label>Preset Sizes</Label>
						<Select value={selectedPreset} onValueChange={onPresetChange}>
							<SelectTrigger>
								<SelectValue placeholder="Select a preset size" />
							</SelectTrigger>
							<SelectContent>
								{PRESET_SIZES.map((size) => (
									<SelectItem key={size.name} value={size.name}>
										{size.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label>Width</Label>
						<Input
							placeholder="Width"
							value={width}
							type="number"
							onChange={(e) => changeWidth(e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label>Height</Label>
						<Input
							placeholder="Height"
							value={height}
							type="number"
							onChange={(e) => changeHeight(e.target.value)}
						/>
					</div>
					<Button type="submit" className="w-full">
						Resize
					</Button>
				</form>
				<div className="p-4">
					<ColorPicker
						value={background as string}
						onChange={changeBackground}
					/>
				</div>
			</ScrollArea>
			<ToolSidebarClose onClick={onClose} />
		</aside>
	);
};
