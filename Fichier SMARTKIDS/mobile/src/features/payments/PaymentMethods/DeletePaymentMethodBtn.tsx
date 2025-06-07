import { Pressable } from "react-native";
import React from "react";
import TrashIcon from "@/assets/icons/trash-1.svg";
import { useDeletePaymentMethodMutation } from "../store/payment.apiSlice";
import { Center, useToast } from "@gluestack-ui/themed";
import { ActivityIndicator } from "react-native";
import { handleApiError } from "@/src/utils/error.util";
import BaseToast from "@/components/BaseToast";
import THEME from "@/constants/theme";

export default function DeletePaymentMethodBtn({
  id,
  type,
}: {
  id: string;
  type: "stripe" | "paypal";
}) {
  const [deleteMethod, { isLoading }] = useDeletePaymentMethodMutation();

  const toast = useToast();
  const handlePress = () => {
    deleteMethod({
      id,
      type,
    }).then((res) => {
      if ("data" in res && res.data) {
        toast.show({
          placement: "top",
          render: () => (
            <BaseToast
              bg="$primary"
              description={res.data?.message ?? "Méthode supprimé."}
            />
          ),
        });
      }

      if ("error" in res) {
        handleApiError({
          error: res.error,
          toast,
        });
      }
    });
  };

  return (
    <Pressable onPress={handlePress}>
      <Center>
        {isLoading ? (
          <ActivityIndicator size="small" color={THEME.colors.DANGER} />
        ) : (
          <TrashIcon width={24} height={24} />
        )}
      </Center>
    </Pressable>
  );
}
