import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Space_Grotesk({
	weight: ["700"],
	subsets: ["latin"],
});

export const Logo = () => {
	return (
		<Link href="/">
			<div className="flex items-center gap-x-2 hover:opacity-75 transition h-[68px] px-4">
				<h2 className={cn(font.className, "text-xl font-bold")}> Graphic AI</h2>
			</div>
		</Link>
	);
};
