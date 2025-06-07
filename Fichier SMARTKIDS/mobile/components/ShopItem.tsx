import { Ionicons } from "@expo/vector-icons"
import { Box, HStack, ImageBackground, VStack } from "@gluestack-ui/themed"
import { StyledText } from "./StyledText"
import { Image } from "@gluestack-ui/themed"
import { Pressable } from "react-native";
import Colors from "../constants/Colors";
import { Etablissement } from "@/src/types";
import config from "@/src/config";

export interface ShopItemProps {
    etablissement: Etablissement;
    onPress: () => void;
    width?: any;
}

export const ShopItem = ({
    etablissement,
    onPress,
    width
}: ShopItemProps) => {


    return (
        <Pressable
            onPress={onPress}
            style={{ width: width }}
        >
            <VStack gap={8} bgColor='$white' padding={16} borderRadius={10}>
                {
                    etablissement.images.length > 0 ?
                        <Image borderRadius={15} w={"100%"} h={108} source={{ uri: `${config.apiURL}/etablissements/${etablissement.images[0].src}` }} alt='boostage' />
                        :
                        <Box borderRadius={15} w={"100%"} h={108} backgroundColor='$light300' />
                }
                <HStack justifyContent='space-between'>
                    <StyledText size={12} weight='semi-bold'>{etablissement.nom}</StyledText>
                    {
                        etablissement.distance && (
                            <StyledText size={12} weight='semi-bold' color={Colors.light.gray}>à {etablissement.distance.toFixed(0)} km</StyledText>
                        )
                    }
                </HStack>
                <StyledText size={12} weight='semi-bold' color={Colors.light.gray}>{etablissement.category.titre}</StyledText>
            </VStack>
        </Pressable>
    )
}