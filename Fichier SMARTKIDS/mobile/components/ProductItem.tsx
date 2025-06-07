import { Ionicons } from "@expo/vector-icons"
import { Box, HStack, ImageBackground, Pressable, VStack } from "@gluestack-ui/themed"
import { StyledText } from "./StyledText"
import { Image } from "@gluestack-ui/themed"

export interface ProductItemProps {
    image?: any;
    title: string;
    description: string;
    price: string;
    onPress: () => void;
}

export const ProductItem = ({
    image,
    title,
    description,
    price,
    onPress
}: ProductItemProps) => {


    return (
        <HStack space='sm' paddingBottom={15} justifyContent='space-between' borderBottomWidth={1} borderColor='$light300' >
            {
                image ?
                    <Image source={image} resizeMode='cover' style={{ width: '15%', height: 48 }} borderRadius={10} />
                :
                    <Box backgroundColor='$light400' style={{ width: '15%', height: 48 }} borderRadius={10} />
            }
            <VStack space='xs' w={'65%'}>
                <StyledText weight='semi-bold'>{title}</StyledText>
                <StyledText color={"rgba(30, 30, 30, 0.6)"}>{description}</StyledText>
            </VStack>
            <VStack space='xs' w={"20%"}>
                <StyledText size={14} weight="semi-bold">{price} €</StyledText>
            </VStack>
        </HStack>
    )
}