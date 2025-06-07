import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import heroBg from "@/assets/images/hero-bg.jpeg";
import logo from "@/assets/images/logo.png";
import { useSigninMutation } from "@/redux/auth/auth.apiSlice";
import {
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  AuthResponse,
  SigninRequest,
  SigninSchema,
} from "@/redux/auth/auth.request";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleApiError } from "@/lib/error.utils";
import { UserRoleEnum } from "@/types/user.types";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/store";
import { logout } from "@/redux/auth/auth.slice";
import { useSignoutMutation } from "../../redux/auth/auth.apiSlice";

export default function SigninPage() {
  const [signin, { isLoading }] = useSigninMutation();

  const form = useForm<SigninRequest>({
    resolver: zodResolver(SigninSchema),
  });

  const { control, handleSubmit, setError } = form;
  const dispatch = useAppDispatch();

  const [logoutFormServer] = useSignoutMutation();

  const navigate = useNavigate();
  const submit = (data: SigninRequest) => {
    signin(data).then((res) => {
      if ("data" in res) {
        const user = (res.data as AuthResponse).data.user;

        if (user.role === UserRoleEnum.ADMIN) {
          navigate("/");
        } else {
          toast.error("Identifiants ou mot de passe incorrect.");
          logoutFormServer().finally(() => {
            dispatch(logout());
          });
        }
      }

      if ("error" in res) {
        handleApiError({
          error: res.error,
          setFormError: setError,
        });
      }
    });
  };

  return (
    <div className="w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center h-screen overflow-hidden">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="flex justify-center">
            <img
              src={logo}
              className="h-28 w-28 object-contain object-center text-center"
            />
          </div>
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Connexion</h1>
            <p className="text-balance text-muted-foreground">
              Veuillez vous connecter pour continuer
            </p>
          </div>
          <Form {...form}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse Email</FormLabel>
                      <FormControl>
                        <Input
                          required
                          type="email"
                          placeholder="email@domain.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <Input
                          required
                          type="password"
                          placeholder="Mot de passe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                onClick={handleSubmit(submit)}
              >
                Se connecter
              </Button>
            </div>
          </Form>
        </div>
      </div>
      <div className="hidden bg-muted lg:block bg-[url('')]">
        <img
          src={heroBg}
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
