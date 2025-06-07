import { Box, Button, HStack, ScrollView } from '@gluestack-ui/themed';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { StyledText } from '../../components/StyledText';
import { Fragment } from 'react';
import SubscriptionScreen from '../SubscriptionScreen';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackParamList } from '@/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

interface componentNameProps {
    onChangeIndex: () => void,
    handleBack: () => void
}

const Step7 = (props: componentNameProps) => {
    const { onChangeIndex, handleBack } = props;
    const { width } = useWindowDimensions();

    const navigation = useNavigation<StackNavigationProp<StackParamList, "subscription">>();

    const route = useRoute<RouteProp<StackParamList, "subscription">>();

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, width: '100%' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Fragment>
                    {/** 
                    <ScrollView>
                        <Box w={width} px={24}>
                            <StyledText size={20} weight='semi-bold'>Opter pour un abonnement a fin de bénéficier d’une visibilité</StyledText>
                        </Box>
                    </ScrollView>
                    */}
                    <Box w={width} flex={1}>
                        <SubscriptionScreen navigation={navigation} route={route} />
                    </Box>
                    <HStack px={24} pt={16} pb={Platform.OS == 'android' ? 16 : 0} alignItems='center' justifyContent='flex-end'>
                        <Pressable onPress={() => navigation.navigate('tab-navigator')}>
                            <StyledText size={14} weight='semi-bold'>Plus tard</StyledText>
                        </Pressable>
                    </HStack>
                </Fragment>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};


export default Step7;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        rowGap: 20,
        columnGap: 30,
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
});
