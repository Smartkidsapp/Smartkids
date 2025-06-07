import { StackScreenProps } from '@react-navigation/stack';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import { StackParamList } from '../navigation';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box } from '@gluestack-ui/themed';
import Step1 from './become-owner-step/Step1';
import { Pressable } from '@gluestack-ui/themed';
import { StyledText } from '../components/StyledText';
import Step0 from './become-owner-step/Step0';
import { ScrollView } from 'react-native-gesture-handler';
import Step2 from './become-owner-step/Step2';
import Step3 from './become-owner-step/Step3';
import Step4 from './become-owner-step/Step4';
import Step5 from './become-owner-step/Step5';
import Step6 from './become-owner-step/Step6';
import Step7 from './become-owner-step/Step7';


export default function BecomeOwnerScreen({
    navigation,
}: StackScreenProps<StackParamList, 'become-owner'>) {
    const { width } = useWindowDimensions();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scrollable, setScrollable] = useState(false);
    const scrollRef = useRef<ScrollView>(null);
    const inset = useSafeAreaInsets();

    const handlPress = async () => {
        if (currentIndex < 8) {
            const index = currentIndex + 1;
            setCurrentIndex(index)
            /*
            setScrollable(true);
            scrollRef.current?.scrollTo({
                x: index * width,
                y: 0,
                animated: true,
            })
            setScrollable(false);
            */
        }
    }

    const handleBack = () => {
        if (currentIndex == 0) {
            navigation.goBack()
        } else {
            const index = currentIndex - 1;
            setCurrentIndex(index)
            /*
            setScrollable(true);
            scrollRef.current?.scrollTo({
                x: index * width,
                y: 0,
                animated: true,
            })
            setScrollable(false);
            */
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerBackTitleVisible: false,
            title: '',
            headerShadowVisible: false,
            headerLeft: () =>
            (
                <Pressable
                    bg="$primary"
                    w={32}
                    h={32}
                    rounded="$full"
                    justifyContent='center'
                    alignItems='center'
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name='close' size={20} color={"#000"} />
                </Pressable>
            ),
            headerRight: () => (
                <Pressable>
                    <StyledText size={14} weight='semi-bold'>Besoin d’aide ?</StyledText>
                </Pressable>
            )
        })
    }, [currentIndex]);

    const Step = useMemo(() => {
        switch (currentIndex) {
            case 0:
                return <Step0 onChangeIndex={handlPress} />;
            case 1:
                return <Step1 onChangeIndex={handlPress} handleBack={handleBack} />;
            case 2:
                return <Step2 onChangeIndex={handlPress} handleBack={handleBack} />;
            case 3:
                return <Step3 onChangeIndex={handlPress} handleBack={handleBack} />;
            case 4:
                return <Step4 onChangeIndex={handlPress} handleBack={handleBack} />;
            case 5:
                return <Step5 onChangeIndex={handlPress} handleBack={handleBack} />;
            case 6:
                return <Step6 onChangeIndex={handlPress} handleBack={handleBack} />;
            case 7:
                return <Step7 onChangeIndex={handlPress} handleBack={handleBack} />;
            default:
                return null;
        }
    }, [currentIndex, handlPress, handleBack]);

    return (
        <Box paddingBottom={inset.bottom} bgColor='$white' flex={1}>
            {
                currentIndex > 0 && (
                    <Box style={{ flexDirection: 'row', marginVertical: 32 }}>
                        {[1, 2, 3, 4, 5, 6, 7].map((item, index) => <Box key={item} bgColor={currentIndex > index ? '$primary' : '$light300'} style={{ flex: 1, height: 5 }} />)}
                    </Box>
                )
            }
            {Step}
            {/*
                <ScrollView
                    horizontal
                    ref={scrollRef}
                    scrollEnabled={scrollable}
                    showsHorizontalScrollIndicator={false}
                    disableScrollViewPanResponder={false}
                >
                    <Step0 onChangeIndex={handlPress} />
                    <Step1 onChangeIndex={handlPress} handleBack={handleBack} />
                    <Step2 onChangeIndex={handlPress} handleBack={handleBack} />
                    <Step3 onChangeIndex={handlPress} handleBack={handleBack} />
                    <Step4 onChangeIndex={handlPress} handleBack={handleBack} />
                    <Step5 onChangeIndex={handlPress} handleBack={handleBack} />
                    <Step6 onChangeIndex={handlPress} handleBack={handleBack} />
                    <Step7 onChangeIndex={handlPress} handleBack={handleBack} />
                </ScrollView>
            */}
        </Box>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
