import React from 'react';
import moment from 'moment';
import { DailyOpeningHour } from './WorkingHourItem';
import { StyledText } from './StyledText';
import { HStack } from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import THEME from '@/constants/theme';
import { useTranslation } from 'react-i18next';

const isEtablissementOpen = (dailyOpeningHours: DailyOpeningHour[]) => {

    const currentDay = new Date().getDay(); // Get current day (0-6, where 0 is Sunday)
    const currentTime = moment(); // Get current time

    // Find today's opening hours
    const todayOpeningHours = dailyOpeningHours.find(hours => hours.day === (currentDay - 1));

    if (!todayOpeningHours || !todayOpeningHours.available) {
        return null; // Closed if no hours or not available today
    }

    // Convert `from` and `to` times to moment objects
    const openingTime = moment(todayOpeningHours.from, 'HH:mm:ss.SSSZ');
    const closingTime = moment(todayOpeningHours.to, 'HH:mm:ss.SSSZ');

    // Check if the current time is within the opening hours
    const isOpen = currentTime.isBetween(openingTime, closingTime);

    return {
        isOpen,
        openingTime: openingTime.format('HH:mm'),
        closingTime: closingTime.format('HH:mm'),
    };
};

const EtablissementStatus = ({ dailyOpeningHours }: { dailyOpeningHours: DailyOpeningHour[] }) => {

    const { t } = useTranslation();

    const status = isEtablissementOpen(dailyOpeningHours);

    if (!status) {
        return (
            <StyledText size={14} weight='semi-bold'>
                Closed Now
            </StyledText>
        );
    }

    const { isOpen, openingTime, closingTime } = status;

    return (
        <HStack space='xs' alignItems='center' mt={16}>
            <Ionicons size={20} name='time-outline' color={isOpen ? THEME.colors.SUCCESS : THEME.colors.DANGER} />
            <StyledText size={14} weight='semi-bold'>
                {isOpen ? `${t('ouvert')} - ${t('ferme_a')} ${closingTime}` : `${t('ferme')} - ${t('ouvre_a')} ${openingTime}`}
            </StyledText>
        </HStack>
    );
};

export default EtablissementStatus;
