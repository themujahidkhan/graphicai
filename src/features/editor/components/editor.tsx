"use client";

import { ActiveTool, selectionDependentTools } from "@/features/editor/types";
import { ArrowLeftRight, ArrowUpDown } from "lucide-react";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useCallback, useEffect, useRef, useState } from "react";

import { AiSidebar } from "@/features/editor/components/ai-sidebar";
import { DrawSidebar } from "@/features/editor/components/draw-sidebar";
import { ElementsSidebar } from "@/features/editor/components/elements-sidebar";
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
import { useUpdateProject } from "@/features/projects/api/use-update-project";
import { useWindowEvents } from "@/features/editor/hooks/use-window-events";

interface EditorProps {
	initialData: ResponseType["data"];
}

export const Editor = ({ initialData }: EditorProps) => {
	const { mutate } = useUpdateProject(initialData.id);
	const [projectName, setProjectName] = useState(initialData.name);
	const [activeTool, setActiveTool] = useState<ActiveTool>("select");

	// Windows Title
	useEffect(() => {
		document.title = initialData.name;
	}, [initialData.name]);

	const onClearSelection = useCallback(() => {
		if (selectionDependentTools.includes(activeTool)) {
			setActiveTool("select");
		}
	}, [activeTool]);

	// Define debouncedSave before using it

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const debouncedSave = useCallback(
		debounce(
			(values: {
				json: string;
				height: number;
				width: number;
				name?: string;
			}) => {
				mutate(values);
			},
			2500,
		),
		[mutate],
	);

	const { init, editor } = useEditor({
		defaultState: initialData.json,
		defaultWidth: initialData.width,
		defaultHeight: initialData.height,
		clearSelectionCallback: onClearSelection,
		saveCallback: debouncedSave,
	});

	// Move useWindowEvents here, after editor is initialized
	const { resetUnsavedChanges } = useWindowEvents(editor);

	const handleProjectNameChange = useCallback((newName: string) => {
		setProjectName(newName);
		debouncedSave({ ...initialData, name: newName });
	}, [debouncedSave, initialData]);



	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		debouncedSave.cancel();
		debouncedSave.flush();

		const newDebouncedSave = debounce(
			(values: {
				json: string;
				height: number;
				width: number;
				name?: string;
			}) => {
				mutate(values);
				resetUnsavedChanges();
			},
			2500,
		);

		debouncedSave.cancel = newDebouncedSave.cancel;
		debouncedSave.flush = newDebouncedSave.flush;
	}, [mutate, resetUnsavedChanges]);


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

			// biome-ignore lint/style/noNonNullAssertion: <explanation>
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
				onProjectNameChange={handleProjectNameChange}
			/>
			<div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
				<Sidebar
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<ElementsSidebar
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
						<ContextMenu>
							<ContextMenuTrigger>
								<div
									className="flex-1 h-[calc(100%-124px)] bg-muted"
									ref={containerRef}
								>
									<canvas ref={canvasRef} />
								</div>
							</ContextMenuTrigger>
							<ContextMenuContent>
								<ContextMenuItem onSelect={() => editor?.bringForward()}>
									Bring Forward
								</ContextMenuItem>
								<ContextMenuItem onSelect={() => editor?.sendBackwards()}>
									Send Backward
								</ContextMenuItem>
								<ContextMenuItem onSelect={() => editor?.bringToFront()}>
									Bring to Front
								</ContextMenuItem>
								<ContextMenuItem onSelect={() => editor?.sendToBack()}>
									Send to Back
								</ContextMenuItem>
							</ContextMenuContent>
						</ContextMenu>
					</div>
					<Footer editor={editor} />
				</main>
			</div>
		</div>
	);
};