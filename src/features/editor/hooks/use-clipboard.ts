import { useCallback, useRef } from "react";

import { fabric } from "fabric";

interface UseClipboardProps {
	canvas: fabric.Canvas | null;
}

export const useClipboard = ({ canvas }: UseClipboardProps) => {
	const clipboard = useRef<fabric.Object | null>(null);

	const copy = useCallback(() => {
		canvas?.getActiveObject()?.clone((cloned: fabric.Object) => {
			clipboard.current = cloned;
		});
	}, [canvas]);

	const paste = useCallback(() => {
		if (!clipboard.current) return;

		clipboard.current.clone((clonedObj: fabric.Object) => {
			canvas?.discardActiveObject();
			if (clonedObj.left !== undefined && clonedObj.top !== undefined) {
				clonedObj.set({
					left: clonedObj.left + 10,
					top: clonedObj.top + 10,
					evented: true,
				});
			}

			if (clonedObj.type === "activeSelection") {
				if (canvas) {
					clonedObj.canvas = canvas;
					(clonedObj as fabric.ActiveSelection).forEachObject(
						(obj: fabric.Object) => {
							canvas.add(obj);
						},
					);
					clonedObj.setCoords();
				}
			} else {
				canvas?.add(clonedObj);
			}

			if (
				clipboard.current &&
				clipboard.current.top !== undefined &&
				clipboard.current.left !== undefined
			) {
				clipboard.current.top += 10;
				clipboard.current.left += 10;
			}
			canvas?.setActiveObject(clonedObj);
			canvas?.requestRenderAll();
		});
	}, [canvas]);

	return { copy, paste };
};
