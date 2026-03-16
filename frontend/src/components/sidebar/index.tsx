  "use client";

  import { Route } from "@/types/route";
  import Link from "next/link";
  import { usePathname } from "next/navigation";
  import { ReactElement, useState } from "react";

  type SidebarProps = {
    routes: Route[];
    className?: string;
  };

  const Sidebar: React.FC<SidebarProps> = ({
    routes,
    className
  }: SidebarProps) => {
    const pathname = usePathname();

    const [activeRoute, setActiveRoute] = useState<string>("");

    return (
      <nav
        className={`fixed h-full bg-[#EBE9E1] left-0 pt-24 ${className} w-[18.6rem] border-r border-[#3f3f3f]`}
      >
        <ul>
          {routes.map((route) => {
            const isSelectedParentRoute =
              route.isCollapsible && activeRoute.includes(route.url);

            const isActive = activeRoute === route.url || (!activeRoute && pathname.includes(route.url));

            return (
              <li
                key={route.url}
                // 1. Adicionamos 'transition-all duration-300 ease-in-out' para animar tudo
                // 2. Fixamos o 'border-l-8' e alternamos apenas a cor da borda entre transparente e escuro
                className={`w-full transition-all duration-300 ease-in-out border-l-8 ${
                  isActive
                    ? "bg-white font-bold text-black border-[#3f3f3f]"
                    : "border-transparent text-secondary400 hover:bg-[#dfddd4]" 
                }`}
              >
                <div
                  className={`flex items-center gap-2 p-3 cursor-pointer`}
                  onClick={() =>
                    route.isCollapsible
                      ? setActiveRoute(route.url)
                      : setActiveRoute("")
                  }
                >
                  {isSelectedParentRoute ? (
                    <div className="flex flex-row gap-2 items-center">
                      {route.icon}
                      <p className="inherit">{route.name}</p>
                    </div>
                  ) : (
                    <Link
                      href={
                        route.isCollapsible
                          ? route.children?.[0].url ?? "#"
                          : route.url
                      }
                      className={`flex items-center gap-2 w-full`}
                    >
                      {route.icon}
                      {route.name}
                    </Link>
                  )}
                </div>
                
                {/* Sub-rotas */}
                {isSelectedParentRoute && (
                  <ul>
                    {route.children?.map((subRoute) => (
                      <li
                        key={`${subRoute.url}`}
                        // Adicionada transição suave também nas sub-rotas
                        className={`flex ml-10 items-center gap-2 pb-3 transition-colors duration-200 ${
                          pathname === subRoute.url 
                            ? "font-bold text-black" 
                            : "font-normal text-gray-500 hover:text-black"
                        }`}
                      >
                        <Link
                          href={subRoute.url}
                          className="w-full"
                        >
                          {subRoute.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    );
  };

  export default Sidebar;