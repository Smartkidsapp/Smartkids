import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

export function handleApiError<T extends FieldValues>({
  defaultMsg = "Une erreur est survenue, veuillez réessayer.",
  error,
  setFormError,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  defaultMsg?: string;
  setFormError?: UseFormSetError<T>;
}) {
  console.log(
    "handleApiError",
    JSON.stringify(
      {
        error,
        messageStr: typeof error?.data?.message === "string",
        msgArray: Array.isArray(error?.data?.message),
      },
      null,
      2
    )
  );

  if (error?.status === "FETCH_ERROR") {
    toast.error("Veuillez vérifier votre connection internet puis réessayer");

    return;
  }

  if (typeof error?.data?.message === "string") {
    toast?.error(error?.data?.message);
  }

  if (error?.data?.errors) {
    for (const key in error?.data?.errors) {
      if (Object.prototype.hasOwnProperty.call(error?.data.errors, key)) {
        const errors = error?.data.errors[key] as string[];
        setFormError?.(key as Path<T>, {
          message: errors.join("\n"),
        });
      }
    }

    return;
  }

  toast?.error(defaultMsg);
}
