import { selectUser } from "@/redux/auth/auth.slice";
import { useAppSelector } from "@/redux/store";
import { useLazyGetProfileQuery } from "@/redux/users/user.apiSlice";
import { UserRoleEnum } from "@/types/user.types";
import { PropsWithChildren, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AuthGuard({ children }: PropsWithChildren) {
  const user = useAppSelector(selectUser);
  const [getProfile] = useLazyGetProfileQuery();
  const navigate = useNavigate();

  const isFirst = useRef<boolean>(true);
  useEffect(() => {
    if (!isFirst.current) {
      return;
    }

    getProfile().then((res) => {
      if ("error" in res || (user && user?.role !== UserRoleEnum.ADMIN)) {
        toast.error("Veuillez vous connecter pour continuer", {
          position: "top-center",
        });
        navigate("/connexion", { replace: true });
      }
    });
    isFirst.current = false;
  }, [user, navigate, isFirst, getProfile]);

  if (!user || user.role !== UserRoleEnum.ADMIN) {
    return null;
  }

  return <>{children}</>;
}
