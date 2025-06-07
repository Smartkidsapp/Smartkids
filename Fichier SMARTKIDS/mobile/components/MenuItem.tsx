import { Ionicons } from "@expo/vector-icons"
import { HStack, ImageBackground, Pressable, VStack } from "@gluestack-ui/themed"
import { StyledText } from "./StyledText"
import { Image } from "@gluestack-ui/themed"

export interface MenuItemProps {
    image: any;
    title: string;
    description: string;
    price: string;
    onPress: () => void;
}

export const MenuItem = ({
    image,
    title,
    description,
    price,
    onPress
}: MenuItemProps) => {


    return (
        <HStack space='sm' paddingBottom={15} justifyContent='space-between' borderBottomWidth={1} borderColor='$light300' >
            <Image source={image} resizeMode='cover' style={{ width: '15%', height: 48 }} borderRadius={10} />
            <VStack space='xs' w={'65%'}>
                <StyledText weight='semi-bold'>{title}</StyledText>
                <StyledText color={"rgba(30, 30, 30, 0.6)"}>{description}</StyledText>
            </VStack>
            <VStack space='xs' w={"20%"}>
                <StyledText size={14} weight="semi-bold">{price} €</StyledText>
                <Pressable
                    bg='$light200'
                    width={32}
                    height={32}
                    borderRadius={100}
                    justifyContent='center'
                    alignItems='center'
                >
                    <Ionicons name='add-outline' color={'rgba(1, 131, 168, 1)'} size={20} />
                </Pressable>
            </VStack>
        </HStack>
    )
}