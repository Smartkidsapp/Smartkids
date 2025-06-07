import { Box, Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel, CheckIcon, EyeIcon, EyeOffIcon, Input, InputField, InputSlot, LockIcon, VStack } from '@gluestack-ui/themed';
import React, { ComponentProps, Ref, useState } from 'react';
import { Pressable, TextInputProps } from 'react-native';
import { StyledText } from './StyledText';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

interface CheckBoxInputProps {
    isChecked: boolean;
    onChange: (value: boolean) => void;
    label: string;
    fontSize?: number; 
}

export default function CheckBoxInput({
    isChecked,
    onChange,
    label,
    fontSize,
    ...props
}: CheckBoxInputProps) {

    return (
        <Box position='relative' zIndex={1} width={18} height={18} borderRadius={4} borderColor={isChecked ? Colors.light.primary : 'rgba(30, 30, 30, 0.6)'} borderWidth={2}>
            <Checkbox width={85} position='absolute' zIndex={2} left={2} top={2} size="md" onChange={onChange} value={''} isInvalid={false} isDisabled={false} isChecked={isChecked}>
                <CheckboxIndicator w={18} h={18} backgroundColor='#FFF' borderColor={isChecked ? Colors.light.primary : 'rgba(30, 30, 30, 0.6)'} mr="$2">
                    <CheckboxIcon bgColor={isChecked ? Colors.light.primary : "rgba(30, 30, 30, 0.6)"} as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel fontSize={fontSize || 14}>{label}</CheckboxLabel>
            </Checkbox>
        </Box>
    );
}
