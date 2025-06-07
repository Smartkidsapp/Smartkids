import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { useUpdatePasswordMutation } from "@/redux/users/user.apiSlice";
import {
  UpdatePasswordDto,
  UpdatePasswordSchema,
} from "@/redux/users/users.request";

export default function UpdatePassword() {
  const [signup, { isLoading }] = useUpdatePasswordMutation();
  const form = useForm<UpdatePasswordDto>({
    resolver: zodResolver(UpdatePasswordSchema),
  });
  const { control, reset, handleSubmit, setError } = form;

  const onSubmit = (data: UpdatePasswordDto) => {
    signup(data).then((res) => {
      if ("data" in res && res.data) {
        if (res.data.message) {
          toast.success("Mot de passe modifié avec succès.");
        }

        reset();
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
    <div className="grid md:gap-8 max-w-screen-lg">
      <Card>
        <CardHeader>
          <CardTitle>Modifier mon mot de passe</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe actuel</FormLabel>
                      <FormControl>
                        <Input
                          required
                          type="password"
                          placeholder="Mot de passe actuel"
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
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nouveau mot de passe</FormLabel>
                      <FormControl>
                        <Input
                          required
                          type="password"
                          placeholder="Nouveau mot de passe"
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
            Changer mon mot de passe
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
