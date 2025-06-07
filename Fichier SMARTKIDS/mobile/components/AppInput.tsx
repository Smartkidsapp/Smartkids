import { EyeIcon, EyeOffIcon, Input, InputField, InputSlot, LockIcon, VStack } from '@gluestack-ui/themed';
import React, { ComponentProps, Ref, useState } from 'react';
import { Pressable, TextInputProps } from 'react-native';
import { StyledText } from './StyledText';
import { Ionicons } from '@expo/vector-icons';

const BORDER_COLOR_DEFAULT = 'rgba(8, 33, 45, 0.3)';
const BORDER_COLOR_FILLED = 'rgba(8, 33, 45, 1)';
const BORDER_COLOR_DANGER = 'rgba(226, 3, 29, 1)';

interface AppInputProps
    extends ComponentProps<typeof InputField>,
    Pick<ComponentProps<typeof Input>, 'isDisabled' | 'isInvalid'> {
    label?: string;
    icon?: JSX.Element;
    rightIcon?: JSX.Element;
    error?: string;
    inputRef?: Ref<TextInputProps>;
    borderColor_?: string;
    containerBg?: string;
}

export default function AppInput({
    label,
    value,
    icon,
    error,
    onChangeText,
    inputRef,
    secureTextEntry,
    borderColor_,
    isDisabled,
    isInvalid,
    rightIcon,
    width,
    containerBg,
    ...props
}: AppInputProps) {
    const [showPswd, setShowPswd] = useState<boolean>(false);

    const eyeIcon = showPswd ? (
        <EyeIcon width={24} height={24} />
    ) : (
        <EyeOffIcon width={24} height={24} />
    );

    const borderColor = isInvalid
        ? BORDER_COLOR_DANGER
        : "none";

    return (
        <VStack space="xs" w={width}>
            {label ? <StyledText weight='semi-bold' size={14}>{label}</StyledText> : null}

            <Input
                h={props.height ? props.height : 50}
                alignItems="center"
                isInvalid={isInvalid}
                isDisabled={isDisabled}
                borderRadius={10}
                borderWidth={1}
                //backgroundColor={containerBg ? containerBg : '$coolGray100'}
                borderColor={"rgba(30, 30, 30, 0.3)"}
            >   
                {icon /*|| secureTextEntry*/ ? (
                    <InputSlot
                        h={50}
                        w={50}
                        justifyContent="center"
                        alignItems="center"
                        borderColor={borderColor_ ?? borderColor}
                    >
                        {secureTextEntry ? (
                            <InputSlot>
                                <Ionicons size={24} name="lock-closed" />
                            </InputSlot>
                        ) : null}

                        {icon ? icon : null}
                    </InputSlot>
                ) : null}
                <InputField
                    //@ts-ignore
                    ref={inputRef}
                    h={50}
                    cursorColor={BORDER_COLOR_DEFAULT}
                    fontSize={14}
                    alignContent="center"
                    fontFamily="Urbanist-Regular"
                    {...props}
                    includeFontPadding={false}
                    paddingVertical={0}
                    verticalAlign="middle"
                    onChangeText={onChangeText}
                    value={value}
                    secureTextEntry={secureTextEntry && !showPswd}
                    placeholderTextColor={borderColor_ ?? BORDER_COLOR_DEFAULT}
                />

                {rightIcon || secureTextEntry ? (
                    <InputSlot w={50} borderColor={borderColor_ ?? borderColor}>
                        {secureTextEntry ? (
                            <Pressable onPress={() => setShowPswd(p => !p)}>
                                {eyeIcon}
                            </Pressable>
                        ) : null}

                        {rightIcon ? rightIcon : null}
                    </InputSlot>
                ) : null}
            </Input>

            {error ? (
                <StyledText size={10} color={BORDER_COLOR_DANGER}>
                    {error}
                </StyledText>
            ) : null}
        </VStack>
    );
}
