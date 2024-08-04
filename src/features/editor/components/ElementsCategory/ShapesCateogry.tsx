import { BsChatSquare, BsDash, BsPentagon, BsStar, BsTriangle } from "react-icons/bs";
import { FaCircle, FaRegSquare, FaSquare, FaStar } from "react-icons/fa";
import { TbPolygon, TbRectangle } from "react-icons/tb";

import { BiMessageSquareDetail } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { Editor } from "@/features/editor/types";
import { useState } from "react";

interface ShapesCategoryProps {
	editor: Editor | undefined;
	searchQuery: string;
}

const shapes = [
	{
		id: "rectangle",
		icon: TbRectangle,
		addFunction: (editor: Editor) => editor.addRectangle(),
	},
	{
		id: "square",
		icon: FaSquare,
		addFunction: (editor: Editor) => editor.addSquare(),
	},
	{
		id: "rounded-square",
		icon: FaRegSquare,
		addFunction: (editor: Editor) => editor.addSoftRectangle(),
	},
	{
		id: "triangle",
		icon: BsTriangle,
		addFunction: (editor: Editor) => editor.addTriangle(),
	},
	{
		id: "polygon",
		icon: TbPolygon,
		addFunction: (editor: Editor) => editor.addPolygon(),
	},
	{
		id: "star",
		icon: FaStar,
		addFunction: (editor: Editor) => editor.addStar(),
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
	{
		id: "callout",
		icon: BiMessageSquareDetail,
		addFunction: (editor: Editor) => editor.addCallout(),
	},
];

export const ShapesCategory = ({
	editor,
	searchQuery,
}: ShapesCategoryProps) => {
	const [showAll, setShowAll] = useState(false);

	const filteredShapes = shapes.filter((shape) =>
		shape.id.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const displayedShapes = showAll ? filteredShapes : filteredShapes.slice(0, 8);

	return (
		<div>
			<div className="flex justify-between items-center mb-2">
				<h3 className="text-lg font-semibold">Shapes</h3>
				{filteredShapes.length > 8 && (
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