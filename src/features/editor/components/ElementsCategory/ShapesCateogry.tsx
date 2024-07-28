import { FaCircle, FaRegSquare, FaSquare } from "react-icons/fa";

import { BsDash } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Editor } from "@/features/editor/types";
import { useState } from "react";

interface ShapesCategoryProps {
	editor: Editor | undefined;
	searchQuery: string;
}

const shapes = [
	{
		id: "square",
		icon: FaSquare,
		addFunction: (editor: Editor) => editor.addRectangle(),
	},
	{
		id: "rounded-square",
		icon: FaRegSquare,
		addFunction: (editor: Editor) => editor.addSoftRectangle(),
	},
	{
		id: "circle",
		icon: FaCircle,
		addFunction: (editor: Editor) => editor.addCircle(),
	},
	{
		id: "line",
		icon: BsDash,
		addFunction: (editor: Editor) => editor.addLine(),
	},
	// Add more shapes as needed
];

export const ShapesCategory = ({
	editor,
	searchQuery,
}: ShapesCategoryProps) => {
	const [showAll, setShowAll] = useState(false);

	const filteredShapes = shapes.filter((shape) =>
		shape.id.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const displayedShapes = showAll ? filteredShapes : filteredShapes.slice(0, 4);

	return (
		<div>
			<div className="flex justify-between items-center mb-2">
				<h3 className="text-lg font-semibold">Shapes</h3>
				{filteredShapes.length > 4 && (
					<Button
						variant="link"
						onClick={() => setShowAll(!showAll)}
						className="text-sm"
					>
						{showAll ? "See less" : "See all"}
					</Button>
				)}
			</div>
			<div className="grid grid-cols-4 gap-2">
				{displayedShapes.map((shape) => (
					<Button
						key={shape.id}
						variant="outline"
						className="aspect-square p-2"
						onClick={() => editor && shape.addFunction(editor)}
					>
						<shape.icon className="w-full h-full" />
					</Button>
				))}
			</div>
		</div>
	);
};
