"use client";

import { fabric } from "fabric";
import { useEffect } from "react";

const SNAP_THRESHOLD = 5;
const GUIDELINE_OFFSET = 0.5;

export const useSnapGuidelines = (canvas: fabric.Canvas | null) => {
	useEffect(() => {
		if (!canvas) return;

		let guidelines: fabric.Line[] = [];

		const removeGuidelines = () => {
			guidelines.forEach((line) => canvas.remove(line));
			guidelines = [];
		};

		const drawVerticalLine = (x: number) => {
			const line = new fabric.Line(
				[x, -canvas.height / 2, x, canvas.height / 2],
				{
					stroke: "#0000FF",
					strokeWidth: 1,
					selectable: false,
					evented: false,
					name: "guideline",
				},
			);
			canvas.add(line);
			guidelines.push(line);
		};

		const drawHorizontalLine = (y: number) => {
			const line = new fabric.Line(
				[-canvas.width / 2, y, canvas.width / 2, y],
				{
					stroke: "#0000FF",
					strokeWidth: 1,
					selectable: false,
					evented: false,
					name: "guideline",
				},
			);
			canvas.add(line);
			guidelines.push(line);
		};

		const onObjectMoving = (e: fabric.IEvent) => {
			removeGuidelines();

			const activeObject = e.target;
			if (!activeObject) return;

			const objectCenter = activeObject.getCenterPoint();
			const objectLeft =
				objectCenter.x -
				((activeObject.width || 0) * (activeObject.scaleX || 1)) / 2;
			const objectRight =
				objectCenter.x +
				((activeObject.width || 0) * (activeObject.scaleX || 1)) / 2;
			const objectTop =
				objectCenter.y -
				((activeObject.height || 0) * (activeObject.scaleY || 1)) / 2;
			const objectBottom =
				objectCenter.y +
				((activeObject.height || 0) * (activeObject.scaleY || 1)) / 2;

			canvas.getObjects().forEach((obj) => {
				if (obj === activeObject || obj.name === "guideline") return;

				const center = obj.getCenterPoint();
				const left = center.x - ((obj.width || 0) * (obj.scaleX || 1)) / 2;
				const right = center.x + ((obj.width || 0) * (obj.scaleX || 1)) / 2;
				const top = center.y - ((obj.height || 0) * (obj.scaleY || 1)) / 2;
				const bottom = center.y + ((obj.height || 0) * (obj.scaleY || 1)) / 2;

				// Vertical alignment
				if (Math.abs(objectLeft - left) < SNAP_THRESHOLD) {
					drawVerticalLine(left - GUIDELINE_OFFSET);
					activeObject.set({ left: left });
				}
				if (Math.abs(objectRight - right) < SNAP_THRESHOLD) {
					drawVerticalLine(right + GUIDELINE_OFFSET);
					activeObject.set({
						left:
							right - (activeObject.width || 0) * (activeObject.scaleX || 1),
					});
				}
				if (Math.abs(objectCenter.x - center.x) < SNAP_THRESHOLD) {
					drawVerticalLine(center.x);
					activeObject.set({
						left:
							center.x -
							((activeObject.width || 0) * (activeObject.scaleX || 1)) / 2,
					});
				}

				// Horizontal alignment
				if (Math.abs(objectTop - top) < SNAP_THRESHOLD) {
					drawHorizontalLine(top - GUIDELINE_OFFSET);
					activeObject.set({ top: top });
				}
				if (Math.abs(objectBottom - bottom) < SNAP_THRESHOLD) {
					drawHorizontalLine(bottom + GUIDELINE_OFFSET);
					activeObject.set({
						top:
							bottom - (activeObject.height || 0) * (activeObject.scaleY || 1),
					});
				}
				if (Math.abs(objectCenter.y - center.y) < SNAP_THRESHOLD) {
					drawHorizontalLine(center.y);
					activeObject.set({
						top:
							center.y -
							((activeObject.height || 0) * (activeObject.scaleY || 1)) / 2,
					});
				}
			});
		};

		const onMouseUp = () => {
			removeGuidelines();
		};

		canvas.on("object:moving", onObjectMoving);
		canvas.on("mouse:up", onMouseUp);

		return () => {
			canvas.off("object:moving", onObjectMoving);
			canvas.off("mouse:up", onMouseUp);
		};
	}, [canvas]);
};
