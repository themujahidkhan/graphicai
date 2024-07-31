import {
	BuildEditorProps,
	CIRCLE_OPTIONS,
	DIAMOND_OPTIONS,
	Editor,
	EditorHookProps,
	FILL_COLOR,
	FONT_FAMILY,
	FONT_SIZE,
	FONT_WEIGHT,
	JSON_KEYS,
	LINE_OPTIONS,
	RECTANGLE_OPTIONS,
	STAR_OPTIONS,
	STROKE_COLOR,
	STROKE_DASH_ARRAY,
	STROKE_WIDTH,
	TEXT_OPTIONS,
	TRIANGLE_OPTIONS,
} from "@/features/editor/types";
import {
	createFilter,
	downloadFile,
	isTextType,
	transformText,
} from "@/features/editor/utils";
import { useCallback, useMemo, useRef, useState } from "react";

import { fabric } from "fabric";
import { useAutoResize } from "@/features/editor/hooks/use-auto-resize";
import { useCanvasEvents } from "@/features/editor/hooks/use-canvas-events";
import { useClipboard } from "@/features/editor/hooks//use-clipboard";
import { useHistory } from "@/features/editor/hooks/use-history";
import { useHotkeys } from "@/features/editor/hooks/use-hotkeys";
import { useLoadState } from "@/features/editor/hooks/use-load-state";
import { useWindowEvents } from "@/features/editor/hooks/use-window-events";

const buildEditor = ({
	save,
	undo,
	redo,
	canRedo,
	canUndo,
	autoZoom,
	copy,
	paste,
	canvas,
	fillColor,
	fontFamily,
	setFontFamily,
	setFillColor,
	strokeColor,
	setStrokeColor,
	strokeWidth,
	setStrokeWidth,
	selectedObjects,
	strokeDashArray,
	setStrokeDashArray,
}: BuildEditorProps): Editor => {
	const generateSaveOptions = () => {
		const { width, height, left, top } = getWorkspace() as fabric.Rect;

		return {
			name: "Image",
			format: "png",
			quality: 1,
			width,
			height,
			left,
			top,
		};
	};

	const bringToFront = () => {
		const activeObject = canvas.getActiveObject();
		if (activeObject) {
			canvas.bringToFront(activeObject);

			// Ensure the workspace stays at the back
			const workspace = getWorkspace();
			if (workspace) {
				canvas.sendToBack(workspace);
			}

			canvas.renderAll();
			save();
		}
	};

	const sendToBack = () => {
		const activeObject = canvas.getActiveObject();
		if (activeObject) {
			// Get all objects except the workspace/background
			const objects = canvas.getObjects().filter((obj) => obj.name !== "clip");

			// Find the index of the first non-workspace object
			const lowestIndex = canvas.getObjects().indexOf(objects[0]);

			// Move the active object to just above the workspace
			canvas.moveTo(activeObject, lowestIndex);

			canvas.renderAll();
			save();
		}
	};

	const savePng = () => {
		const options = generateSaveOptions();

		canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
		const dataUrl = canvas.toDataURL(options);

		downloadFile(dataUrl, "png");
		autoZoom();
	};

	const saveSvg = () => {
		const options = generateSaveOptions();

		canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
		const dataUrl = canvas.toDataURL(options);

		downloadFile(dataUrl, "svg");
		autoZoom();
	};

	const saveJpg = () => {
		const options = generateSaveOptions();

		canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
		const dataUrl = canvas.toDataURL(options);

		downloadFile(dataUrl, "jpg");
		autoZoom();
	};

	const saveJson = async () => {
		const dataUrl = canvas.toJSON(JSON_KEYS);

		await transformText(dataUrl.objects);
		const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(
			JSON.stringify(dataUrl, null, "\t"),
		)}`;
		downloadFile(fileString, "json");
	};

	const loadJson = (json: string) => {
		const data = JSON.parse(json);

		canvas.loadFromJSON(data, () => {
			autoZoom();
		});
	};

	const getWorkspace = () => {
		return canvas.getObjects().find((object) => object.name === "clip");
	};

	const center = (object: fabric.Object) => {
		const workspace = getWorkspace();
		const center = workspace?.getCenterPoint();

		if (!center) return;

		// @ts-ignore
		canvas._centerObject(object, center);
	};

	const addToCanvas = (object: fabric.Object) => {
		center(object);
		canvas.add(object);
		canvas.setActiveObject(object);
	};

	const removeGuidelines = () => {
		const guidelines = canvas
			.getObjects()
			.filter((obj) => obj.name === "guideline");
		guidelines.forEach((guideline) => canvas.remove(guideline));
		canvas.renderAll();
	};

	return {
		savePng,
		saveJpg,
		saveSvg,
		saveJson,
		loadJson,
		canUndo,
		canRedo,
		autoZoom,
		getWorkspace,
		bringToFront,
		sendToBack,
		zoomIn: () => {
			let zoomRatio = canvas.getZoom();
			zoomRatio += 0.05;
			const center = canvas.getCenter();
			canvas.zoomToPoint(
				new fabric.Point(center.left, center.top),
				zoomRatio > 1 ? 1 : zoomRatio,
			);
		},
		zoomOut: () => {
			let zoomRatio = canvas.getZoom();
			zoomRatio -= 0.05;
			const center = canvas.getCenter();
			canvas.zoomToPoint(
				new fabric.Point(center.left, center.top),
				zoomRatio < 0.2 ? 0.2 : zoomRatio,
			);
		},
		changeSize: (value: { width: number; height: number }) => {
			const workspace = getWorkspace();

			workspace?.set(value);
			autoZoom();
			save();
		},
		changeBackground: (value: string) => {
			const workspace = getWorkspace();
			workspace?.set({ fill: value });
			canvas.renderAll();
			save();
		},
		enableDrawingMode: () => {
			canvas.discardActiveObject();
			canvas.renderAll();
			canvas.isDrawingMode = true;
			canvas.freeDrawingBrush.width = strokeWidth;
			canvas.freeDrawingBrush.color = strokeColor;
		},
		disableDrawingMode: () => {
			canvas.isDrawingMode = false;
		},
		onUndo: () => {
			undo();
			removeGuidelines();
		},
		onRedo: () => {
			redo();
			removeGuidelines();
		},
		onCopy: () => copy(),
		onPaste: () => paste(),
		changeImageFilter: (value: string) => {
			const objects = canvas.getActiveObjects();
			objects.forEach((object) => {
				if (object.type === "image") {
					const imageObject = object as fabric.Image;

					const effect = createFilter(value);

					imageObject.filters = effect ? [effect] : [];
					imageObject.applyFilters();
					canvas.renderAll();
				}
			});
		},
		addImage: (value: string) => {
			fabric.Image.fromURL(
				value,
				(image) => {
					const workspace = getWorkspace();

					image.scaleToWidth(workspace?.width || 0);
					image.scaleToHeight(workspace?.height || 0);

					addToCanvas(image);
				},
				{
					crossOrigin: "anonymous",
				},
			);
		},
		delete: () => {
			canvas.getActiveObjects().forEach((object) => canvas.remove(object));
			canvas.discardActiveObject();
			canvas.renderAll();
		},
		addText: (value, options) => {
			const object = new fabric.Textbox(value, {
				...TEXT_OPTIONS,
				fill: fillColor,
				...options,
			});

			addToCanvas(object);
		},
		getActiveOpacity: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return 1;
			}

			const value = selectedObject.get("opacity") || 1;

			return value;
		},
		changeFontSize: (value: number) => {
			canvas.getActiveObjects().forEach((object) => {
				if (isTextType(object.type)) {
					// @ts-ignore
					// Faulty TS library, fontSize exists.
					object.set({ fontSize: value });
				}
			});
			canvas.renderAll();
		},
		getActiveFontSize: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return FONT_SIZE;
			}

			// @ts-ignore
			// Faulty TS library, fontSize exists.
			const value = selectedObject.get("fontSize") || FONT_SIZE;

			return value;
		},
		changeTextAlign: (value: string) => {
			canvas.getActiveObjects().forEach((object) => {
				if (isTextType(object.type)) {
					// @ts-ignore
					// Faulty TS library, textAlign exists.
					object.set({ textAlign: value });
				}
			});
			canvas.renderAll();
		},
		getActiveTextAlign: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return "left";
			}

			// @ts-ignore
			// Faulty TS library, textAlign exists.
			const value = selectedObject.get("textAlign") || "left";

			return value;
		},
		changeFontUnderline: (value: boolean) => {
			canvas.getActiveObjects().forEach((object) => {
				if (isTextType(object.type)) {
					// @ts-ignore
					// Faulty TS library, underline exists.
					object.set({ underline: value });
				}
			});
			canvas.renderAll();
		},
		getActiveFontUnderline: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return false;
			}

			// @ts-ignore
			// Faulty TS library, underline exists.
			const value = selectedObject.get("underline") || false;

			return value;
		},
		changeFontLinethrough: (value: boolean) => {
			canvas.getActiveObjects().forEach((object) => {
				if (isTextType(object.type)) {
					// @ts-ignore
					// Faulty TS library, linethrough exists.
					object.set({ linethrough: value });
				}
			});
			canvas.renderAll();
		},
		getActiveFontLinethrough: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return false;
			}

			// @ts-ignore
			// Faulty TS library, linethrough exists.
			const value = selectedObject.get("linethrough") || false;

			return value;
		},
		changeFontStyle: (value: string) => {
			canvas.getActiveObjects().forEach((object) => {
				if (isTextType(object.type)) {
					// @ts-ignore
					// Faulty TS library, fontStyle exists.
					object.set({ fontStyle: value });
				}
			});
			canvas.renderAll();
		},
		getActiveFontStyle: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return "normal";
			}

			// @ts-ignore
			// Faulty TS library, fontStyle exists.
			const value = selectedObject.get("fontStyle") || "normal";

			return value;
		},
		changeFontWeight: (value: number) => {
			canvas.getActiveObjects().forEach((object) => {
				if (isTextType(object.type)) {
					// @ts-ignore
					// Faulty TS library, fontWeight exists.
					object.set({ fontWeight: value });
				}
			});
			canvas.renderAll();
		},
		changeOpacity: (value: number) => {
			canvas.getActiveObjects().forEach((object) => {
				object.set({ opacity: value });
			});
			canvas.renderAll();
		},
		bringForward: () => {
			canvas.getActiveObjects().forEach((object) => {
				canvas.bringForward(object);
			});

			canvas.renderAll();

			const workspace = getWorkspace();
			workspace?.sendToBack();
		},
		sendBackwards: () => {
			canvas.getActiveObjects().forEach((object) => {
				canvas.sendBackwards(object);
			});

			canvas.renderAll();
			const workspace = getWorkspace();
			workspace?.sendToBack();
		},
		changeFontFamily: (value: string) => {
			setFontFamily(value);
			canvas.getActiveObjects().forEach((object) => {
				if (isTextType(object.type)) {
					// @ts-ignore
					// Faulty TS library, fontFamily exists.
					object.set({ fontFamily: value });
				}
			});
			canvas.renderAll();
		},
		changeFillColor: (value: string) => {
			setFillColor(value);
			canvas.getActiveObjects().forEach((object) => {
				object.set({ fill: value });
			});
			canvas.renderAll();
		},
		changeStrokeColor: (value: string) => {
			setStrokeColor(value);
			canvas.getActiveObjects().forEach((object) => {
				// Text types don't have stroke
				if (isTextType(object.type)) {
					object.set({ fill: value });
					return;
				}

				object.set({ stroke: value });
			});
			canvas.freeDrawingBrush.color = value;
			canvas.renderAll();
		},
		changeStrokeWidth: (value: number) => {
			setStrokeWidth(value);
			canvas.getActiveObjects().forEach((object) => {
				object.set({ strokeWidth: value });
			});
			canvas.freeDrawingBrush.width = value;
			canvas.renderAll();
		},
		changeStrokeDashArray: (value: number[]) => {
			setStrokeDashArray(value);
			canvas.getActiveObjects().forEach((object) => {
				object.set({ strokeDashArray: value });
			});
			canvas.renderAll();
		},
		addCircle: () => {
			const object = new fabric.Circle({
				...CIRCLE_OPTIONS,
				fill: fillColor,
				stroke: strokeColor,
				strokeWidth: strokeWidth,
				strokeDashArray: strokeDashArray,
			});

			addToCanvas(object);
		},
		addSoftRectangle: () => {
			const object = new fabric.Rect({
				...RECTANGLE_OPTIONS,
				rx: 50,
				ry: 50,
				fill: fillColor,
				stroke: strokeColor,
				strokeWidth: strokeWidth,
				strokeDashArray: strokeDashArray,
			});

			addToCanvas(object);
		},
		addRectangle: () => {
			const object = new fabric.Rect({
				...RECTANGLE_OPTIONS,
				fill: fillColor,
				stroke: strokeColor,
				strokeWidth: strokeWidth,
				strokeDashArray: strokeDashArray,
			});

			addToCanvas(object);
		},
		addTriangle: () => {
			const object = new fabric.Triangle({
				...TRIANGLE_OPTIONS,
				fill: fillColor,
				stroke: strokeColor,
				strokeWidth: strokeWidth,
				strokeDashArray: strokeDashArray,
			});

			addToCanvas(object);
		},
		addInverseTriangle: () => {
			const HEIGHT = TRIANGLE_OPTIONS.height;
			const WIDTH = TRIANGLE_OPTIONS.width;

			const object = new fabric.Polygon(
				[
					{ x: 0, y: 0 },
					{ x: WIDTH, y: 0 },
					{ x: WIDTH / 2, y: HEIGHT },
				],
				{
					...TRIANGLE_OPTIONS,
					fill: fillColor,
					stroke: strokeColor,
					strokeWidth: strokeWidth,
					strokeDashArray: strokeDashArray,
				},
			);

			addToCanvas(object);
		},
		addDiamond: () => {
			const HEIGHT = DIAMOND_OPTIONS.height;
			const WIDTH = DIAMOND_OPTIONS.width;

			const diamond = new fabric.Polygon(
				[
					{ x: WIDTH / 2, y: 0 },
					{ x: WIDTH, y: HEIGHT / 2 },
					{ x: WIDTH / 2, y: HEIGHT },
					{ x: 0, y: HEIGHT / 2 },
				],
				{
					...DIAMOND_OPTIONS,
					fill: fillColor,
					stroke: strokeColor,
					strokeWidth: strokeWidth,
					strokeDashArray: strokeDashArray,
				},
			);

			addToCanvas(diamond);
		},
		addStar: () => {
			const starPath =
				"M 0 -50 L 14.64 -25 L 47.55 -15.45 L 23.77 5.45 L 29.39 38.04 L 0 22.5 L -29.39 38.04 L -23.77 5.45 L -47.55 -15.45 Z";
			const star = new fabric.Path(starPath, {
				...STAR_OPTIONS,
				fill: fillColor,
				stroke: strokeColor,
				strokeWidth: strokeWidth,
				strokeDashArray: strokeDashArray,
			});
			addToCanvas(star);
		},

		addLine: () => {
			const line = new fabric.Line([0, 0, LINE_OPTIONS.width, 0], {
				...LINE_OPTIONS,
				stroke: strokeColor,
				strokeWidth: strokeWidth,
				strokeDashArray: strokeDashArray,
			});
			addToCanvas(line);
		},

		canvas,
		getActiveFontWeight: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return FONT_WEIGHT;
			}

			// @ts-ignore
			// Faulty TS library, fontWeight exists.
			const value = selectedObject.get("fontWeight") || FONT_WEIGHT;

			return value;
		},
		getActiveFontFamily: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return fontFamily;
			}

			// @ts-ignore
			// Faulty TS library, fontFamily exists.
			const value = selectedObject.get("fontFamily") || fontFamily;

			return value;
		},
		getActiveFillColor: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return fillColor;
			}

			const value = selectedObject.get("fill") || fillColor;

			// Currently, gradients & patterns are not supported
			return value as string;
		},
		getActiveStrokeColor: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return strokeColor;
			}

			const value = selectedObject.get("stroke") || strokeColor;

			return value;
		},
		getActiveStrokeWidth: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return strokeWidth;
			}

			const value = selectedObject.get("strokeWidth") || strokeWidth;

			return value;
		},
		getActiveStrokeDashArray: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return strokeDashArray;
			}

			const value = selectedObject.get("strokeDashArray") || strokeDashArray;

			return value;
		},
		selectedObjects,
		removeGuidelines,
	};
};

export const useEditor = ({
	defaultState,
	defaultHeight,
	defaultWidth,
	clearSelectionCallback,
	saveCallback,
}: EditorHookProps) => {
	const initialState = useRef(defaultState);
	const initialWidth = useRef(defaultWidth);
	const initialHeight = useRef(defaultHeight);

	const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);

	const [fontFamily, setFontFamily] = useState(FONT_FAMILY);
	const [fillColor, setFillColor] = useState(FILL_COLOR);
	const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
	const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
	const [strokeDashArray, setStrokeDashArray] =
		useState<number[]>(STROKE_DASH_ARRAY);

	useWindowEvents();

	const { save, canRedo, canUndo, undo, redo, canvasHistory, setHistoryIndex } =
		useHistory({
			canvas,
			saveCallback,
		});

	const { copy, paste } = useClipboard({ canvas });

	const { autoZoom } = useAutoResize({
		canvas,
		container,
	});

	useCanvasEvents({
		save,
		canvas,
		setSelectedObjects,
		clearSelectionCallback,
	});

	useHotkeys({
		undo,
		redo,
		copy,
		paste,
		save,
		canvas,
	});

	useLoadState({
		canvas,
		autoZoom,
		initialState,
		canvasHistory,
		setHistoryIndex,
	});

	const editor = useMemo(() => {
		if (canvas) {
			return buildEditor({
				save,
				undo,
				redo,
				canUndo,
				canRedo,
				autoZoom,
				copy,
				paste,
				canvas,
				fillColor,
				strokeWidth,
				strokeColor,
				setFillColor,
				setStrokeColor,
				setStrokeWidth,
				strokeDashArray,
				selectedObjects,
				setStrokeDashArray,
				fontFamily,
				setFontFamily,
			});
		}

		return undefined;
	}, [
		canRedo,
		canUndo,
		undo,
		redo,
		save,
		autoZoom,
		copy,
		paste,
		canvas,
		fillColor,
		strokeWidth,
		strokeColor,
		selectedObjects,
		strokeDashArray,
		fontFamily,
	]);

	const init = useCallback(
		({
			initialCanvas,
			initialContainer,
		}: {
			initialCanvas: fabric.Canvas;
			initialContainer: HTMLDivElement;
		}) => {
			fabric.Object.prototype.set({
				cornerColor: "#FFF",
				cornerStyle: "circle",
				borderColor: "#3b82f6",
				borderScaleFactor: 1.5,
				transparentCorners: false,
				borderOpacityWhenMoving: 1,
				cornerStrokeColor: "#3b82f6",
			});

			const initialWorkspace = new fabric.Rect({
				width: initialWidth.current,
				height: initialHeight.current,
				name: "clip",
				fill: "white",
				selectable: false,
				hasControls: false,
				shadow: new fabric.Shadow({
					color: "rgba(0,0,0,0.8)",
					blur: 5,
				}),
			});

			initialCanvas.setWidth(initialContainer.offsetWidth);
			initialCanvas.setHeight(initialContainer.offsetHeight);

			initialCanvas.add(initialWorkspace);
			initialCanvas.centerObject(initialWorkspace);
			initialCanvas.clipPath = initialWorkspace;

			setCanvas(initialCanvas);
			setContainer(initialContainer);

			const currentState = JSON.stringify(initialCanvas.toJSON(JSON_KEYS));
			canvasHistory.current = [currentState];
			setHistoryIndex(0);
		},
		[
			canvasHistory, // No need, this is from useRef
			setHistoryIndex, // No need, this is from useState
		],
	);

	return { init, editor };
};
