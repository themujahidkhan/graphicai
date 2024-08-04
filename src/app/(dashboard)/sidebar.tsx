import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

export const Sidebar = () => {
	return (
		<aside className="hidden lg:flex fixed flex-col w-[300px] left-0 shrink-0 h-full ">
			<div className="h-[68px] flex items-center px-4">
				<Logo />
			</div>
			<SidebarRoutes />
		</aside>
	);
};
