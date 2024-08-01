import { useEffect, useState } from "react";

export const useWindowEvents = (editor: any) => {
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	useEffect(() => {
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (hasUnsavedChanges) {
				event.preventDefault();
				event.returnValue =
					"You have unsaved changes. Are you sure you want to leave?";
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [hasUnsavedChanges]);

	useEffect(() => {
		if (editor && editor.canvas) {
			const handleEditorChange = () => {
				setHasUnsavedChanges(true);
			};

			editor.canvas.on("object:modified", handleEditorChange);
			editor.canvas.on("object:added", handleEditorChange);
			editor.canvas.on("object:removed", handleEditorChange);

			return () => {
				editor.canvas.off("object:modified", handleEditorChange);
				editor.canvas.off("object:added", handleEditorChange);
				editor.canvas.off("object:removed", handleEditorChange);
			};
		}
	}, [editor]);

	const resetUnsavedChanges = () => {
		setHasUnsavedChanges(false);
	};

	return { resetUnsavedChanges };
};
