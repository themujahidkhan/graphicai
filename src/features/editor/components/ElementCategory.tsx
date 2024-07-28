import { Button } from "@/components/ui/button";
import { Editor } from "@/features/editor/types";
import Image from "next/image";
import { useState } from "react";

interface ElementCategoryProps {
	title: string;
	editor: Editor | undefined;
	searchQuery: string;
}

export const ElementCategory = ({
	title,
	editor,
	searchQuery,
}: ElementCategoryProps) => {
	const [showAll, setShowAll] = useState(false);

	// This is a placeholder. In a real implementation, you'd fetch this data from your database.
	const elements = [
		{
			id: 1,
			name: "Element 1",
			imageUrl: "/path/to/image1.png",
			isPremium: false,
		},
		{
			id: 2,
			name: "Element 2",
			imageUrl: "/path/to/image2.png",
			isPremium: true,
		},
		// ... more elements
	];

	const filteredElements = elements.filter((element) =>
		element.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const displayedElements = showAll
		? filteredElements
		: filteredElements.slice(0, 4);

	return (
		<div>
			<h3 className="text-lg font-semibold mb-2">{title}</h3>
			<div className="grid grid-cols-2 gap-4">
				{displayedElements.map((element) => (
					<div key={element.id} className="relative group">
						<Image
							src={element.imageUrl}
							alt={element.name}
							width={150}
							height={150}
							className="rounded-md cursor-pointer"
							onClick={() => {
								// Add logic to add element to canvas
							}}
						/>
						{element.isPremium && (
							<span className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded-full">
								PRO
							</span>
						)}
					</div>
				))}
			</div>
			{filteredElements.length > 4 && (
				<Button
					variant="link"
					onClick={() => setShowAll(!showAll)}
					className="mt-2"
				>
					{showAll ? "Show less" : "See all"}
				</Button>
			)}
		</div>
	);
};
