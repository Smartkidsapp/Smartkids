import { Button } from "@/components/ui/button";
import { useSignoutMutation } from "@/redux/auth/auth.apiSlice";
import { logout } from "@/redux/auth/auth.slice";
import { useAppDispatch } from "@/redux/store";
import { useNavigate } from "react-router-dom";

export default function LogoutBtn() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logoutFormServer, { isLoading }] = useSignoutMutation();

  const handleLogout = () => {
    logoutFormServer().finally(() => {
      dispatch(logout());
      navigate("/connexion");
    });
  };

  return (
    <Button disabled={isLoading} onClick={handleLogout} className="w-full">
      Déconnexion
    </Button>
  );
}
