"use client";

import { Route } from "@/types/route";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";



type NavbarProps = {
  routes: Route[];
  className?: string;
};

const Navbar: React.FC<NavbarProps> = ({ routes, className }: NavbarProps) => {
  const pathname = usePathname();
  const divRef = useRef<HTMLDivElement | null>(null);

  const [parentActiveRoute, setParentActiveRoute] = useState<string>("");
  const [isParentRouteOpen, setIsParentRouteOpen] = useState<boolean>(false);

  // Efeito para fechar a rota pai ao clicar fora do componente
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setIsParentRouteOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setParentActiveRoute]);

  return (
    <nav
      className={`fixed h-16 bg-[#EBE9E1] bottom-0 p-3 ${className} w-full rounded-t-xl border-t shadow-2xl`}
    >
      <ul className="flex justify-between">
        {routes?.map((route) => {
          const isSelectedParentRoute =
            route.isCollapsible && parentActiveRoute === route.url;

          return (
            <li
              key={route.url}
              className={`gap-2 w-full flex items-center justify-center h-10 rounded-xl ${
                (parentActiveRoute === route.url ||
                  (!parentActiveRoute && pathname.includes(route.url))) &&
                "bg-[#3F3E3E]"
              }`}
            >
              <div
                ref={divRef}
                className={`flex items-center justify-center gap-2 w-full h-full`}
                onClick={() => {
                  if (route.isCollapsible) {
                    setParentActiveRoute(route.url);
                    setIsParentRouteOpen((prevState) => !prevState);
                  } else {
                    setParentActiveRoute("");
                  }
                }}
              >
                {isSelectedParentRoute || route.isCollapsible ? (
                  <div
                    className={`${
                      pathname.includes(route.url)
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {route.icon}
                  </div>
                ) : (
                  <Link
                    href={
                      route.isCollapsible
                        ? route.children?.[0].url ?? "#"
                        : route.url
                    }
                    as={
                      route.isCollapsible
                        ? route.children?.[0].url ?? "#"
                        : route.url
                    }
                    className={`flex items-center justify-center p-3 w-full h-full ${
                      parentActiveRoute === route.url ||
                      (!parentActiveRoute && pathname === route.url)
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {route.icon}
                  </Link>
                )}
              </div>
              {isParentRouteOpen && route.url === parentActiveRoute && (
                <ul
                  className="bg-white absolute right-2 p-2 rounded-md shadow-lg"
                  style={{ top: -(route.navOverlay ?? 130) }}
                >
                  {route.children?.map((subRoute) => (
                    <li
                      key={`${subRoute.url}`}
                      className={`flex items-center gap-2 pb-3 text-gray-700 ${
                        pathname === subRoute.url ? "font-bold" : "font-normal"
                      }`}
                    >
                      <Link
                        href={subRoute.url}
                        className="text-secondary400"
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

export default Navbar;
