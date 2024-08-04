import {
	ActiveTool,
	Editor,
	FONT_SIZE,
	FONT_WEIGHT,
} from "@/features/editor/types";
import {
	IconAlignCenter,
	IconAlignLeft,
	IconAlignRight,
	IconBold,
	IconBorderNone,
	IconChevronDown,
	IconColorFilter,
	IconCopy,
	IconItalic,
	IconPalette,
	IconRectangle,
	IconSpacingHorizontal,
	IconSpacingVertical,
	IconStackPop,
	IconStackPush,
	IconStrikethrough,
	IconTexture,
	IconTrash,
	IconUnderline,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { FontSizeInput } from "@/features/editor/components/font-size-input";
import { Hint } from "@/components/hint";
import { cn } from "@/lib/utils";
import { isTextType } from "@/features/editor/utils";
import { useState } from "react";

interface ToolbarProps {
	editor: Editor | undefined;
	activeTool: ActiveTool;
	onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Toolbar = ({
	editor,
	activeTool,
	onChangeActiveTool,
}: ToolbarProps) => {
	const initialFillColor = editor?.getActiveFillColor();
	const initialStrokeColor = editor?.getActiveStrokeColor();
	const initialFontFamily = editor?.getActiveFontFamily();
	const initialFontWeight = editor?.getActiveFontWeight() || FONT_WEIGHT;
	const initialFontStyle = editor?.getActiveFontStyle();
	const initialFontLinethrough = editor?.getActiveFontLinethrough();
	const initialFontUnderline = editor?.getActiveFontUnderline();
	const initialTextAlign = editor?.getActiveTextAlign();
	const initialFontSize = editor?.getActiveFontSize() || FONT_SIZE;

	const [properties, setProperties] = useState({
		fillColor: initialFillColor,
		strokeColor: initialStrokeColor,
		fontFamily: initialFontFamily,
		fontWeight: initialFontWeight,
		fontStyle: initialFontStyle,
		fontLinethrough: initialFontLinethrough,
		fontUnderline: initialFontUnderline,
		textAlign: initialTextAlign,
		fontSize: initialFontSize,
	});

	const selectedObject = editor?.selectedObjects[0];
	const selectedObjectType = editor?.selectedObjects[0]?.type;

	const isText = isTextType(selectedObjectType);
	const isImage = selectedObjectType === "image";

	const onChangeFontSize = (value: number) => {
		if (!selectedObject) {
			return;
		}

		editor?.changeFontSize(value);
		setProperties((current) => ({
			...current,
			fontSize: value,
		}));
	};

	const onChangeTextAlign = (value: string) => {
		if (!selectedObject) {
			return;
		}

		editor?.changeTextAlign(value);
		setProperties((current) => ({
			...current,
			textAlign: value,
		}));
	};

	const toggleBold = () => {
		if (!selectedObject) {
			return;
		}

		const newValue = properties.fontWeight > 500 ? 500 : 700;

		editor?.changeFontWeight(newValue);
		setProperties((current) => ({
			...current,
			fontWeight: newValue,
		}));
	};

	const toggleItalic = () => {
		if (!selectedObject) {
			return;
		}

		const isItalic = properties.fontStyle === "italic";
		const newValue = isItalic ? "normal" : "italic";

		editor?.changeFontStyle(newValue);
		setProperties((current) => ({
			...current,
			fontStyle: newValue,
		}));
	};

	const toggleLinethrough = () => {
		if (!selectedObject) {
			return;
		}

		const newValue = !properties.fontLinethrough;

		editor?.changeFontLinethrough(newValue);
		setProperties((current) => ({
			...current,
			fontLinethrough: newValue,
		}));
	};

	const toggleUnderline = () => {
		if (!selectedObject) {
			return;
		}

		const newValue = !properties.fontUnderline;


		editor?.changeFontUnderline(newValue);
		setProperties((current) => ({
			...current,
			fontUnderline: newValue,
		}));
	};

	if (editor?.selectedObjects.length === 0) {
		return (
			<div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2" />
		);
	}

	return (
		<div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2">
			{!isImage && (
				<div className="flex items-center h-full justify-center">
					<Hint label="Color" side="bottom" sideOffset={5}>
						<Button
							onClick={() => onChangeActiveTool("fill")}
							size="icon"
							variant="ghost"
							className={cn(activeTool === "fill" && "bg-gray-100")}
						>
							<div
								className="rounded-sm size-4 border"
								style={{ backgroundColor: properties.fillColor }}
							/>
						</Button>
					</Hint>
				</div>
			)}
			{!isText && (
				<div className="flex items-center h-full justify-center">
					<Hint label="Stroke color" side="bottom" sideOffset={5}>
						<Button
							onClick={() => onChangeActiveTool("stroke-color")}
							size="icon"
							variant="ghost"
							className={cn(activeTool === "stroke-color" && "bg-gray-100")}
						>
							<div
								className="rounded-sm size-4 border-2 bg-white"
								style={{ borderColor: properties.strokeColor }}
							/>
						</Button>
					</Hint>
				</div>
			)}
			{!isText && (
				<div className="flex items-center h-full justify-center">
					<Hint label="Stroke width" side="bottom" sideOffset={5}>
						<Button
							onClick={() => onChangeActiveTool("stroke-width")}
							size="icon"
							variant="ghost"
							className={cn(activeTool === "stroke-width" && "bg-gray-100")}
						>
							<IconBorderNone size={24} stroke={1} />
						</Button>
					</Hint>
				</div>
			)}
			{isText && (
				<div className="flex items-center h-full justify-center">
					<Hint label="Font" side="bottom" sideOffset={5}>
						<Button
							onClick={() => onChangeActiveTool("font")}
							size="icon"
							variant="ghost"
							className={cn(
								"w-auto px-2 text-sm",
								activeTool === "font" && "bg-gray-100",
							)}
						>
							<div className="max-w-[100px] truncate">
								{properties.fontFamily}
							</div>
							<IconChevronDown className="size-4 ml-2 shrink-0" />
						</Button>
					</Hint>
				</div>
			)}
			{isText && (
				<div className="flex items-center h-full justify-center">
					<Hint label="Bold" side="bottom" sideOffset={5}>
						<Button
							onClick={toggleBold}
							size="icon"
							variant="ghost"
							className={cn(properties.fontWeight > 500 && "bg-gray-100")}
						>
							<IconBold size={24} stroke={1} />
						</Button>
					</Hint>
				</div>
			)}
			{isText && (
				<div className="flex items-center h-full justify-center">
					<Hint label="Italic" side="bottom" sideOffset={5}>
						<Button
							onClick={toggleItalic}
							size="icon"
							variant="ghost"
							className={cn(properties.fontStyle === "italic" && "bg-gray-100")}
						>
							<IconItalic size={24} stroke={1} />
						</Button>
					</Hint>
				</div>
			)}
			{isText && (
				<div className="flex items-center h-full justify-center">
					<Hint label="Underline" side="bottom" sideOffset={5}>
						<Button
							onClick={toggleUnderline}
							size="icon"
							variant="ghost"
							className={cn(properties.fontUnderline && "bg-gray-100")}
						>
							<IconUnderline size={24} stroke={1} />
						</Button>
					</Hint>
				</div>
			)}
			{isText && (
				<div className="flex items-center h-full justify-center">
					<Hint label="Strike" side="bottom" sideOffset={5}>
						<Button
							onClick={toggleLinethrough}
							size="icon"
							variant="ghost"
							className={cn(properties.fontLinethrough && "bg-gray-100")}
						>
							<IconStrikethrough size={24} stroke={1} />
						</Button>
					</Hint>
				</div>
			)}
			{isText && (
				<div className="flex items-center h-full justify-center">
					<Hint label="Align left" side="bottom" sideOffset={5}>
						<Button
							onClick={() => onChangeTextAlign("left")}
							size="icon"
							variant="ghost"
							className={cn(properties.textAlign === "left" && "bg-gray-100")}
						>
							<IconAlignLeft size={24} stroke={1} />
						</Button>
					</Hint>
				</div>
			)}
			{isText && (
				<div className="flex items-center h-full justify-center">
					<Hint label="Align center" side="bottom" sideOffset={5}>
						<Button
							onClick={() => onChangeTextAlign("center")}
							size="icon"
							variant="ghost"
							className={cn(properties.textAlign === "center" && "bg-gray-100")}
						>
							<IconAlignCenter size={24} stroke={1} />
						</Button>
					</Hint>
				</div>
			)}
			{isText && (
				<div className="flex items-center h-full justify-center">
					<Hint label="Align right" side="bottom" sideOffset={5}>
						<Button
							onClick={() => onChangeTextAlign("right")}
							size="icon"
							variant="ghost"
							className={cn(properties.textAlign === "right" && "bg-gray-100")}
						>
							<IconAlignRight size={24} stroke={1} />
						</Button>
					</Hint>
				</div>
			)}
			{isText && (
				<div className="flex items-center h-full justify-center">
					<FontSizeInput
						value={properties.fontSize}
						onChange={onChangeFontSize}
					/>
				</div>
			)}
			{isImage && (
				<div className="flex items-center h-full justify-center">
					<Hint label="Filters" side="bottom" sideOffset={5}>
						<Button
							onClick={() => onChangeActiveTool("filter")}
							size="icon"
							variant="ghost"
							className={cn(activeTool === "filter" && "bg-gray-100")}
						>
							<IconColorFilter size={24} stroke={1} />
						</Button>
					</Hint>
				</div>
			)}
			{isImage && (
				<div className="flex items-center h-full justify-center">
					<Hint label="Remove background" side="bottom" sideOffset={5}>
						<Button
							onClick={() => onChangeActiveTool("remove-bg")}
							size="icon"
							variant="ghost"
							className={cn(activeTool === "remove-bg" && "bg-gray-100")}
						>
							<IconRectangle size={24} stroke={1} />
						</Button>
					</Hint>
				</div>
			)}
			<div className="flex items-center h-full justify-center">
				<Hint label="Bring forward" side="bottom" sideOffset={5}>
					<Button
						onClick={() => editor?.bringForward()}
						size="icon"
						variant="ghost"
					>
						<IconStackPop size={24} stroke={1} />
					</Button>
				</Hint>
			</div>
			<div className="flex items-center h-full justify-center">
				<Hint label="Send backwards" side="bottom" sideOffset={5}>
					<Button
						onClick={() => editor?.sendBackwards()}
						size="icon"
						variant="ghost"
					>
						<IconStackPush size={24} stroke={1} />
					</Button>
				</Hint>
			</div>
			<div className="flex items-center h-full justify-center">
				<Hint label="Opacity" side="bottom" sideOffset={5}>
					<Button
						onClick={() => onChangeActiveTool("opacity")}
						size="icon"
						variant="ghost"
						className={cn(activeTool === "opacity" && "bg-gray-100")}
					>
						<IconTexture size={24} stroke={1} />
					</Button>
				</Hint>
			</div>
			<div className="flex items-center h-full justify-center">
				<Hint label="Duplicate" side="bottom" sideOffset={5}>
					<Button
						onClick={() => {
							editor?.onCopy();
							editor?.onPaste();
						}}
						size="icon"
						variant="ghost"
					>
						<IconCopy size={24} stroke={1} />
					</Button>
				</Hint>
			</div>
			<div className="flex items-center h-full justify-center">
				<Hint label="Delete" side="bottom" sideOffset={5}>
					<Button onClick={() => editor?.delete()} size="icon" variant="ghost">
						<IconTrash size={24} stroke={1} />
					</Button>
				</Hint>
			</div>
		</div>
	);
};
