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
import { useGetCategoryQuery, useUpdateCategoryMutation } from "@/redux/categories/categories.apiSlice";
import { useState } from "react";

export default function EditCategory() {
    const { id } = useParams<{ id: string; name: string }>();
    const [params] = useSearchParams();

    const { data: category } = useGetCategoryQuery(id!);

    const [icon, setIcon] = useState<any>();

    const [update, { isLoading }] = useUpdateCategoryMutation();
    const form = useForm<CategoryDto>({
        resolver: zodResolver(CategorySchema),
        values: {
            id: category?.data.id || '',
            titre: category?.data.titre || '',
            titre_en: category?.data.titre_en || '',
            description: category?.data.description || ''
        }
    });
    const { control, reset, handleSubmit, setError, setValue } = form;
    const navigate = useNavigate();

    const onSubmit = (data: CategoryDto) => {
        data.icon = icon;
        if (category?.data) {
            update({ ...data, id: category?.data.id }).then((res) => {
                if ("data" in res && res.data) {
                    if (res.data.message) {
                        toast.success("Catégorie modifiée avec succès.");
                    }

                    reset();
                    navigate("/categories")
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
                    { path: "/categories", label: "Categories" },
                    //@ts-ignore
                    { current: true, label: "Modifier" ?? "" },
                ]}
            />

            <div className="grid p-4 sm:px-6 sm:py-0 md:gap-8 max-w-screen-lg">
                <Card>
                    <CardHeader>
                        <CardTitle>Modifier une catégorie</CardTitle>
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
                                        name="icon"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Image</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        required={false}
                                                        type="file"
                                                        onChange={(e) => setIcon(e.target.files![0])}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {
                                        category?.data.icon && (
                                            <img src={category.data.icon.src} style={{ width: 100 }} />
                                        )
                                    }
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
