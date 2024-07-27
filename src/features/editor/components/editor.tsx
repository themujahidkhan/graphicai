"use client";

import { ActiveTool, selectionDependentTools } from "@/features/editor/types";
import { useCallback, useEffect, useRef, useState } from "react";

import { AiSidebar } from "@/features/editor/components/ai-sidebar";
import { DrawSidebar } from "@/features/editor/components/draw-sidebar";
import { FillColorSidebar } from "@/features/editor/components/fill-color-sidebar";
import { FilterSidebar } from "@/features/editor/components/filter-sidebar";
import { FontSidebar } from "@/features/editor/components/font-sidebar";
import { Footer } from "@/features/editor/components/footer";
import { ImageSidebar } from "@/features/editor/components/image-sidebar";
import { Navbar } from "@/features/editor/components/navbar";
import { OpacitySidebar } from "@/features/editor/components/opacity-sidebar";
import { RemoveBgSidebar } from "@/features/editor/components/remove-bg-sidebar";
import { ResponseType } from "@/features/projects/api/use-get-project";
import { SettingsSidebar } from "@/features/editor/components/settings-sidebar";
import { ShapeSidebar } from "@/features/editor/components/shape-sidebar";
import { Sidebar } from "@/features/editor/components/sidebar";
import { StrokeColorSidebar } from "@/features/editor/components/stroke-color-sidebar";
import { StrokeWidthSidebar } from "@/features/editor/components/stroke-width-sidebar";
import { TemplateSidebar } from "@/features/editor/components/template-sidebar";
import { TextSidebar } from "@/features/editor/components/text-sidebar";
import { Toolbar } from "@/features/editor/components/toolbar";
import { UploadSidebar } from "@/features/editor/components/upload-sidebar";
import debounce from "lodash.debounce";
import { fabric } from "fabric";
import { useEditor } from "@/features/editor/hooks/use-editor";
import { useSnapGuidelines } from "@/features/editor/hooks/use-snap-guidelines";
import { useUpdateProject } from "@/features/projects/api/use-update-project";

interface EditorProps {
	initialData: ResponseType["data"];
}
export const Editor = ({ initialData }: EditorProps) => {
	const { mutate } = useUpdateProject(initialData.id);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedSave = useCallback(
		debounce(
			(values: {
				json: string;
				height: number;
				width: number;
			}) => {
				mutate(values);
			},
			2500,
		),
		[mutate],
	);

	const [activeTool, setActiveTool] = useState<ActiveTool>("select");

	const onClearSelection = useCallback(() => {
		if (selectionDependentTools.includes(activeTool)) {
			setActiveTool("select");
		}
	}, [activeTool]);

	const { init, editor } = useEditor({
		defaultState: initialData.json,
		defaultWidth: initialData.width,
		defaultHeight: initialData.height,
		clearSelectionCallback: onClearSelection,
		saveCallback: debouncedSave,
	});
	useSnapGuidelines(editor?.canvas || null);

	const onChangeActiveTool = useCallback(
		(tool: ActiveTool) => {
			if (tool === "draw") {
				editor?.enableDrawingMode();
			}

			if (activeTool === "draw") {
				editor?.disableDrawingMode();
			}

			if (tool === activeTool) {
				return setActiveTool("select");
			}

			setActiveTool(tool);
		},
		[activeTool, editor],
	);

	const canvasRef = useRef(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const canvas = new fabric.Canvas(canvasRef.current, {
			controlsAboveOverlay: true,
			preserveObjectStacking: true,
		});

		init({
			initialCanvas: canvas,
			initialContainer: containerRef.current!,
		});

		return () => {
			canvas.dispose();
		};
	}, [init]);

	return (
		<div className="h-full flex flex-col">
			<Navbar
				id={initialData.id}
				editor={editor}
				activeTool={activeTool}
				onChangeActiveTool={setActiveTool}
				initialProjectName={initialData.name}
			/>
			<div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
				<Sidebar
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<ShapeSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<FillColorSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<StrokeColorSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<StrokeWidthSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<OpacitySidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<TextSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<FontSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<ImageSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<UploadSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={setActiveTool}
				/>
				<TemplateSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<FilterSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<AiSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<RemoveBgSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<DrawSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<SettingsSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<main className="bg-muted flex-1 overflow-auto relative flex flex-col">
					<Toolbar
						editor={editor}
						activeTool={activeTool}
						onChangeActiveTool={onChangeActiveTool}
						key={JSON.stringify(editor?.canvas.getActiveObject())}
					/>
					<div
						className="flex-1 h-[calc(100%-124px)] bg-muted"
						ref={containerRef}
					>
						<canvas ref={canvasRef} />
					</div>
					<Footer editor={editor} />
				</main>
			</div>
		</div>
	);
};
