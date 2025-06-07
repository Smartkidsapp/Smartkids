import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AppBreadCrumb from "../Layouts/DashboardLayout/AppBreadCrumb";
import { Button } from "@/components/ui/button";
import { useSignupMutation } from "@/redux/auth/auth.apiSlice";
import { SignupDto, SignupSchema } from "@/redux/auth/auth.request";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { handleApiError } from "@/lib/error.utils";
import {
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export default function NewUser() {
  const [signup, { isLoading }] = useSignupMutation();
  const form = useForm<SignupDto>({
    resolver: zodResolver(SignupSchema),
  });
  const { control, reset, handleSubmit, setError } = form;
  const navigate = useNavigate();

  const onSubmit = (data: SignupDto) => {
    signup(data).then((res) => {
      if ("data" in res && res.data) {
        if (res.data.message) {
          toast.success("Utilisateur créé avec succès.");
        }

        reset();
        navigate("/utilisateurs")
        return;
      }

      if ("error" in res && res.error) {
        handleApiError({
          error: res.error,
          setFormError: setError,
        });
      }
    });
  };

  return (
    <>
      <AppBreadCrumb
        paths={[
          { path: "/", label: "Tableau de bord" },
          { path: "/utilisateurs", label: "Utilisateurs" },
          { current: true, label: "Ajouter" ?? "" },
        ]}
      />

      <div className="grid p-4 sm:px-6 sm:py-0 md:gap-8 max-w-screen-lg">
        <Card>
          <CardHeader>
            <CardTitle>Ajouter un utilisateur</CardTitle>
          </CardHeader>
          <CardContent>
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom(s) et prénom(s)</FormLabel>
                        <FormControl>
                          <Input
                            required
                            type="text"
                            placeholder="Nom(s) et prénom(s)"
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro de téléphone</FormLabel>
                        <FormControl>
                          <Input
                            required
                            type="text"
                            placeholder="Numéro de téléphone"
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
              </div>
            </Form>
          </CardContent>
          <CardFooter>
            <Button
              disabled={isLoading}
              className="w-full"
              onClick={handleSubmit(onSubmit)}
            >
              Ajouter
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
