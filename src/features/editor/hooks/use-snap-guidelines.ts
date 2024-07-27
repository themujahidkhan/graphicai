"use client"

import { fabric } from 'fabric';
import { useEffect } from 'react';

const SNAP_THRESHOLD = 10;
const GUIDELINE_OFFSET = 5;
const GUIDELINE_COLOR = 'rgba(255, 0, 0, 0.8)';

export const useSnapGuidelines = (canvas: fabric.Canvas | null) => {
  useEffect(() => {
    if (!canvas) return;

    let guidelines: fabric.Line[] = [];

    const drawVerticalLine = (x: number) => {
      const line = new fabric.Line([x, 0, x, canvas.height || 0], {
        stroke: GUIDELINE_COLOR,
        strokeWidth: 1,
        selectable: false,
        evented: false,
      });
      guidelines.push(line);
      canvas.add(line);
    };

    const drawHorizontalLine = (y: number) => {
      const line = new fabric.Line([0, y, canvas.width || 0, y], {
        stroke: GUIDELINE_COLOR,
        strokeWidth: 1,
        selectable: false,
        evented: false,
      });
      guidelines.push(line);
      canvas.add(line);
    };

    const removeGuidelines = () => {
      guidelines.forEach((line) => canvas.remove(line));
      guidelines = [];
    };

    const onObjectMoving = (e: fabric.IEvent) => {
      const activeObject = e.target;
      if (!activeObject) return;

      removeGuidelines();

      const objectCenter = activeObject.getCenterPoint();
      const objectLeft = activeObject.left || 0;
      const objectTop = activeObject.top || 0;
      const objectRight = objectLeft + (activeObject.width || 0) * (activeObject.scaleX || 1);
      const objectBottom = objectTop + (activeObject.height || 0) * (activeObject.scaleY || 1);

      canvas.getObjects().forEach((obj) => {
        if (obj === activeObject) return;

        const center = obj.getCenterPoint();
        const left = obj.left || 0;
        const top = obj.top || 0;
        const right = left + (obj.width || 0) * (obj.scaleX || 1);
        const bottom = top + (obj.height || 0) * (obj.scaleY || 1);

        // Vertical alignments
        if (Math.abs(objectCenter.x - center.x) < SNAP_THRESHOLD) {
          drawVerticalLine(center.x);
          activeObject.set({ left: center.x - (activeObject.width || 0) * (activeObject.scaleX || 1) / 2 });
        }
        if (Math.abs(objectLeft - left) < SNAP_THRESHOLD) {
          drawVerticalLine(left - GUIDELINE_OFFSET);
          activeObject.set({ left: left });
        }
        if (Math.abs(objectRight - right) < SNAP_THRESHOLD) {
          drawVerticalLine(right + GUIDELINE_OFFSET);
          activeObject.set({ left: right - (activeObject.width || 0) * (activeObject.scaleX || 1) });
        }

        // Horizontal alignments
        if (Math.abs(objectCenter.y - center.y) < SNAP_THRESHOLD) {
          drawHorizontalLine(center.y);
          activeObject.set({ top: center.y - (activeObject.height || 0) * (activeObject.scaleY || 1) / 2 });
        }
        if (Math.abs(objectTop - top) < SNAP_THRESHOLD) {
          drawHorizontalLine(top - GUIDELINE_OFFSET);
          activeObject.set({ top: top });
        }
        if (Math.abs(objectBottom - bottom) < SNAP_THRESHOLD) {
          drawHorizontalLine(bottom + GUIDELINE_OFFSET);
          activeObject.set({ top: bottom - (activeObject.height || 0) * (activeObject.scaleY || 1) });
        }
      });

      canvas.renderAll();
    };

    const onObjectModified = () => {
      removeGuidelines();
      canvas.renderAll();
    };

    const onMouseUp = () => {
      removeGuidelines();
      canvas.renderAll();
    };

    canvas.on('object:moving', onObjectMoving);
    canvas.on('object:modified', onObjectModified);
    canvas.on('mouse:up', onMouseUp);

    return () => {
      canvas.off('object:moving', onObjectMoving);
      canvas.off('object:modified', onObjectModified);
      canvas.off('mouse:up', onMouseUp);
      removeGuidelines();
    };
  }, [canvas]);
};