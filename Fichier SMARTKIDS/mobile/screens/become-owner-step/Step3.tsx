import { Box, Button, HStack, ScrollView, Pressable, VStack } from '@gluestack-ui/themed';
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { StyledText } from '../../components/StyledText';
import { Fragment, useCallback, useMemo, useState } from 'react';
import WorkingHourItem, { DailyOpeningHour, DAYS_LABELS, WeekDay } from '../../components/WorkingHourItem';
import { timeLabelToIsoTimeStr, timeLabelToTimeStr } from '../../src/utils/date';
import { useAppDispatch, useAppSelector } from '../../src/store';
import { selectEtablissement, setCreateEtablissement } from '../../src/features/etablissement/etablissement.slice';
import { Services } from '@/src/types';
import { useFieldArray, useForm } from 'react-hook-form';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import THEME from '@/constants/theme';
import ControlledTextInput from '@/components/ControlledTextInput';
import { useTranslation } from 'react-i18next';

interface componentNameProps {
    onChangeIndex: () => void,
    handleBack: () => void
}

interface ServicesFormData {
    services: Services[];
}

export type CurrentOpeningHours = Map<WeekDay, DailyOpeningHour>;

const INITIAL_OPENING_HOURS: CurrentOpeningHours = [1, 2, 3, 4, 5, 6, 0]
    .map((day) => ({
        day,
        from: "08h00",
        to: "18h00",
        available: true,
    }))
    .reduce((acc, curr) => {
        acc.set(curr.day as WeekDay, curr);
        return acc;
    }, new Map() as CurrentOpeningHours);

const Step3 = (props: componentNameProps) => {

    const { t } = useTranslation();

    const { onChangeIndex, handleBack } = props;
    const { width } = useWindowDimensions();
    const { createEtablissement } = useAppSelector(selectEtablissement);
    const dispatch = useAppDispatch();

    const [currentDailyopeningHours, setcurrentDailyopeningHours] = useState<Map<WeekDay, DailyOpeningHour>>(() => {
        return INITIAL_OPENING_HOURS;
    });

    const [services, setServices] = useState<Services[]>(
        createEtablissement?.services || []
    );

    const { control, handleSubmit, setError, reset } = useForm<ServicesFormData>(
        {
            defaultValues: {
                services:
                    services?.length > 0 ?
                        services
                        : [],
            },
        }
    );

    const { fields, append, remove } = useFieldArray({
        control: control,
        name: "services",
    });

    const onSubmit = (data: ServicesFormData) => {
        const openinHours = Array.from(currentDailyopeningHours.keys()).map(
            (op) => {
                const opHours = currentDailyopeningHours.get(op as WeekDay)!;
                return {
                    ...opHours,
                    from: timeLabelToTimeStr(opHours.from),
                    to: timeLabelToTimeStr(opHours.to),
                };
            }
        );

        if (data.services.length > 0) {
            let validServices = data.services.filter((service) => {
                console.log(service.title.length)
                if (service.title.length > 0 && service.price.length >= 0) {
                    return { title: service.title, price: service.price } as Services;
                }
            });

            dispatch(setCreateEtablissement({ services: validServices }));
        } else {
            dispatch(setCreateEtablissement({ services: [] }));
        }

        dispatch(setCreateEtablissement({dailyOpeningHours: openinHours}));

        onChangeIndex();
        
    };

    const onChange = useCallback(
      (op: DailyOpeningHour) => {
        setcurrentDailyopeningHours((prev) => {
          const nextV = new Map();
          Array.from(prev.keys()).map((k) => {
            if (k == op.day) {
              nextV.set(op.day, op);
            } else {
              nextV.set(k, prev.get(k));
            }
          });
          return nextV;
        });
      },
      [setcurrentDailyopeningHours]
    );


    const OpeningHours = useMemo(() => {
        const openinHours = Array.from(currentDailyopeningHours.keys()).map((op) =>
            currentDailyopeningHours.get(op as WeekDay)
        );

        return openinHours.map((op) => {
            return (
                <WorkingHourItem
                    key={`${op!.day}_${op?.from}_${op?.to}`}
                    day={op!.day as WeekDay}
                    value={op!}
                    onChange={onChange}
                />
            );
        });
    }, [currentDailyopeningHours]);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, width: '100%' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Fragment>
                    <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                        <Box w={width} px={24}>
                            <StyledText size={20} weight='semi-bold'>{t('service_et_horaires')}</StyledText>
                            <StyledText size={16} weight='semi-bold' style={{ marginTop: 32 }}>{t('services_que_vous_proposez')}</StyledText>
                            <Box alignItems='flex-start' mt={16}>

                                {fields.map((field, index) => (
                                    <HStack
                                        key={field.id}
                                        alignItems="center"
                                        w="$full"
                                        paddingBottom={index < fields.length - 1 ? 8 : 0}
                                        justifyContent='space-between'
                                    >
                                        <HStack space='md' w={"85%"}>
                                            <Box flex={6}>
                                                <ControlledTextInput
                                                    placeholder={`${t('service')} *`}
                                                    name={`services.${index}.title`}
                                                    control={control}
                                                    required
                                                />
                                            </Box>
                                            <VStack flex={4} gap={4}>
                                                <ControlledTextInput
                                                    placeholder={`${t('prix')} *`}
                                                    name={`services.${index}.price`}
                                                    control={control}
                                                    required
                                                    //icon={<MaterialIcons name="euro-symbol" size={20} />}
                                                />
                                            </VStack>
                                        </HStack>
                                        <Pressable
                                            w="10%"
                                            onPress={() => remove(index)}
                                            alignItems='flex-end'
                                        >
                                            <Ionicons size={24} color={THEME.colors.DANGER} name='trash' />
                                        </Pressable>
                                    </HStack>
                                ))}
                                <Pressable
                                    mt={16}
                                    onPress={() =>
                                        append({
                                            title: "",
                                            price: ""
                                        })
                                    }
                                >
                                    <HStack
                                        justifyContent='center'
                                        alignItems='center'
                                    >
                                        <StyledText size={14} weight='semi-bold' color={Colors.light.textPrimary}>{t('ajouter')}</StyledText>
                                        <Ionicons size={18} color={Colors.light.textPrimary} name='add' />
                                    </HStack>
                                </Pressable>
                            </Box>
                            <StyledText size={16} weight='semi-bold' style={{ marginTop: 32 }}>{t('horaires_d_ouvertures')}</StyledText>
                            <Box alignItems='flex-start' mt={16}>
                                {OpeningHours}
                            </Box>
                        </Box>
                    </ScrollView>
                    <HStack px={24} pt={16} pb={Platform.OS == 'android' ? 16 : 0} alignItems='center' justifyContent='space-between'>
                        <Pressable onPress={handleBack}>
                            <StyledText size={14} weight='semi-bold'>{t('retour')}</StyledText>
                        </Pressable>
                        <Button
                            height={50}
                            width='auto'
                            px={50}
                            borderRadius={10}
                            bgColor='$primary'
                            onPress={handleSubmit(onSubmit)}
                        >
                            <StyledText size={14} weight='semi-bold'>{t('next')}</StyledText>
                        </Button>
                    </HStack>
                </Fragment>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const WorkingDayHourItem = ({ day, index, onChange }: { day: any, index: number, onChange?: (value: DailyOpeningHour) => void }) => {

    const [value, setValue] = useState<DailyOpeningHour>({
        from: "09h00",
        to: "00h00",
        day: index,
        available: true
    });


    return (
        <WorkingHourItem
            key={index}
            day={index as WeekDay}
            value={value}
            onChange={setValue}
        />
    );
}


export default Step3;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        rowGap: 20,
        columnGap: 30,
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
});
