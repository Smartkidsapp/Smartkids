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
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CategoryDto, CategorySchema } from "@/redux/categories/categories.request";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllCategoriesQuery, useGetCategoryQuery, useUpdateCategoryMutation } from "@/redux/categories/categories.apiSlice";
import { useEffect, useState } from "react";
import { useCreateOptionMutation, useGetOptionQuery, useUpdateOptionMutation } from "@/redux/options/options.apiSlice";
import { OptionDto, OptionSchema } from "@/redux/options/options.request";
import MultiSelect from "@/components/MultiSelect";

export default function NewOption() {

    const { data: categories } = useGetAllCategoriesQuery();

    const [value, setValue] = useState<string[]>([]);

    const [create, { isLoading }] = useCreateOptionMutation();
    const form = useForm<OptionDto>({
        resolver: zodResolver(OptionSchema)
    });
    const { control, reset, handleSubmit, setError } = form;
    const navigate = useNavigate();

    const onSubmit = (data: OptionDto) => {
        if (data) {
            data.categories = value;
            create(data).then((res) => {
                if ("data" in res && res.data) {
                    if (res.data.message) {
                        toast.success("Option créé avec succès.");
                    }

                    reset();
                    navigate("/options")
                    return;
                }

                if ("error" in res && res.error) {
                    handleApiError({
                        error: res.error,
                        setFormError: setError,
                    });
                }
            });
        }
    };

    return (
        <>
            <AppBreadCrumb
                paths={[
                    { path: "/", label: "Tableau de bord" },
                    { path: "/options", label: "Options" },
                    //@ts-ignore
                    { current: true, label: "Ajouter" ?? "" },
                ]}
            />

            <div className="grid p-4 sm:px-6 sm:py-0 md:gap-8 max-w-screen-lg">
                <Card>
                    <CardHeader>
                        <CardTitle>Ajouter une option</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <FormField
                                        control={control}
                                        name="titre"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Titre</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        required
                                                        type="text"
                                                        placeholder="Entrez le titre"
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
                                        name="titre_en"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Titre en anglais</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        required
                                                        type="text"
                                                        placeholder="Entrez le titre"
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
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        required
                                                        placeholder="Décrivez la catégorie..."
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
                                        name="categories"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Catégories</FormLabel>
                                                <FormControl>
                                                    <MultiSelect
                                                        value={value}
                                                        items={categories?.data.map((category) => ({ label: category.titre, value: category.id })) ?? []}
                                                        onChange={(v) => {
                                                            field.onChange(v[v.length - 1] ?? null);
                                                            setValue(v);
                                                        }}
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
                            Modifier
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
