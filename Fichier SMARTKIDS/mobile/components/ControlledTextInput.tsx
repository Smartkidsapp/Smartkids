import React, { ComponentProps } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import AppInput from './AppInput';
import AppTextArea from './AppTextArea';

type ControlledTextInputProps<T extends FieldValues> =
    | (ComponentProps<typeof AppTextArea> & {
        textArea: true;
        control: Control<T, any>;
        name: Path<T>;
        rules?: ComponentProps<typeof Controller>['rules'];
        required?: boolean;
    })
    | (ComponentProps<typeof AppInput> & {
        textArea?: false;
        control: Control<T, any>;
        name: Path<T>;
        rules?: ComponentProps<typeof Controller>['rules'];
        required?: boolean;
    });

export default function ControlledTextInput<T extends FieldValues>({
    control,
    name,
    rules = {},
    textArea = false,
    required = false,
    width,
    ...props
}: ControlledTextInputProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            rules={{ required: required, ...rules }}
            render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { error },
            }) => {
                let errorMessage = error
                    ? error.type === 'required'
                        ? 'Ce champ est requis'
                        : error.message
                    : undefined;

                return (
                    <>
                        {textArea ? (
                            <AppTextArea
                                onChangeText={onChange}
                                onBlur={onBlur}
                                value={value}
                                // @ts-ignore
                                isInvalid={!!error}
                                inputRef={ref}
                                error={errorMessage}
                                {...props}
                            />
                        ) : (
                            <AppInput
                                onChangeText={v => {
                                    if (
                                        props.textContentType === 'telephoneNumber' &&
                                        v.length &&
                                        ![
                                            '0',
                                            '1',
                                            '2',
                                            '3',
                                            '4',
                                            '5',
                                            '6',
                                            '7',
                                            '8',
                                            '9',
                                            '+',
                                        ].includes(v[v.length - 1])
                                    ) {
                                        return;
                                    }

                                    onChange(v);
                                }}
                                onBlur={onBlur}
                                value={value}
                                isInvalid={!!error}
                                inputRef={ref}
                                error={errorMessage}
                                width={width}
                                {...props}
                            />
                        )}
                    </>
                );
            }}
        />
    );
}
