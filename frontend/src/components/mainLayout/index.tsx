"use client";

import useResponsiveDetect from "@/hooks/useResponsiveDetect";
import Sidebar from "../sidebar";
import Navbar from "../navbar";
import Header from "../header";
import { Route } from "@/types/route";
import { BookmarkIcon, ChartBarIcon, ClipboardDocumentIcon, ClipboardDocumentListIcon, ClockIcon, DocumentPlusIcon, FilmIcon, PencilIcon, ShoppingCartIcon, TagIcon, UserIcon, UsersIcon, VideoCameraIcon } from "@heroicons/react/24/solid";
import { usePathname, useRouter } from "next/navigation";
import { SnackbarProvider } from "../widgets/snackbar";
import { useSelector } from "react-redux";
import { getPerfil } from "@/store/modules/perfil/selectors";
import { useEffect } from "react";
import { LockClock } from "@mui/icons-material";


export default function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {

  const responsiveSize = useResponsiveDetect();


  const path = usePathname();
  const { push } = useRouter();
  //const usuario = useUser();

  //const dispatch = useAppDispatch();
  const perfil = useSelector(getPerfil)
  console.log(perfil)

  useEffect(() => {
    if (perfil === "Cliente") {
      push("/login")
    }

  }, [perfil])

  const routes: Route[] = [
    {
      url: "/admin/indexacao",
      name: "Indexação",
      icon: <DocumentPlusIcon className=" w-5 h-5" />
    },
    {
      url: "/admin/historico",
      name: "Histórico",
      icon: <ClockIcon className=" w-5 h-5" />
    }, {
      url: "/admin/usuarios",
      name: "Usuários",
      icon: <UsersIcon className=" w-5 h-5" />
    }, {
      url: "/admin/metricas",
      name: "Métricas",
      icon: <ChartBarIcon className=" w-5 h-5" />
    }, {
      url: "/admin/auditoria",
      name: "Auditoria",
      icon: <ClipboardDocumentListIcon className=" w-5 h-5" />
    }
  ]


  const isPublic = !path.includes("admin")

  return (
    <>
      <SnackbarProvider>
        {isPublic && (
          <>
              <div className={path.includes("busca") ? "" : "hidden"}>
              <Header titulo={"FindLES"} />
            </div>
            <div>
              {children}
            </div>
          </>
        )}
        {!isPublic && (
          <main className="flex min-h-screen flex-col overflow-auto">

            <>
              <Header titulo={"FindLES"} />
              {
                responsiveSize !== "md" &&
                responsiveSize !== "sm" && (
                  <Sidebar className={perfil === "Cliente" ? "hidden" : ""} routes={routes} />
                )}
              <div className={perfil === "Cliente" ? "m-4 mb-16 pb-10 lg:mt-28" : "m-4 mb-16 md:mb-10 lg:ml-80 lg:mr-6 pb-10 lg:mt-28"} >
                {children}
              </div>
              {
                (responsiveSize === "md" || responsiveSize === "sm") && (
                  <Navbar className={perfil === "Cliente" ? "hidden" : ""} routes={routes} />
                )}
            </>
          </main>
        )}
      </SnackbarProvider>
    </>
  );
}
