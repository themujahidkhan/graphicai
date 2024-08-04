import Link from "next/link";
import { Space_Grotesk } from "next/font/google";

interface LogoProps {
	className?: string;
}

const font = Space_Grotesk({
	weight: ["700"],
	subsets: ["latin"],
});

export const Logo = ({ className }: LogoProps) => {
	return (
		<Link href="/">
			<div className={`flex items-center ${className}`}>
				<h2 className="text-xl font-bold">Graphic AI</h2>
			</div>
		</Link>
	);
};