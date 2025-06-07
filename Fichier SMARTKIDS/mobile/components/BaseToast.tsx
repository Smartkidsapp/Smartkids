import React, { ComponentProps, useId } from 'react';
import {
  Icon,
  Toast,
  ToastDescription,
  ToastTitle,
  VStack,
  Pressable,
} from '@gluestack-ui/themed';
import { CloseIcon } from '@gluestack-ui/themed';

interface BaseToastProps extends ComponentProps<typeof Toast> {
  title?: string;
  description?: string;
  dismissable?: boolean;
  toast?: {
    show: (props: any) => any;
    close: (id: any) => void;
    closeAll: () => void;
    isActive: (id: any) => boolean;
  };
}

export default function BaseToast({
  description,
  title,
  variant = 'solid',
  bg = 'rgba(253, 123, 45, 0.2)',
  dismissable = false,
  toast,
  id: _id,
  ...rest
}: BaseToastProps) {
  let id = useId();
  id = _id || id;

  return (
    <Toast
      variant={variant}
      {...rest}
      action="attention"
      bg={bg}
      mt={76}
      nativeID={id}
      zIndex={99999}>
      <VStack space="sm">
        {title ? (
          <ToastTitle color="#fff" fontFamily="Poppins-Regular">
            {title}
          </ToastTitle>
        ) : null}

        {description ? (
          <ToastDescription color="#fff" fontFamily="Poppins-Regular">
            {description}
          </ToastDescription>
        ) : null}
      </VStack>
      {dismissable ? (
        <Pressable mt="$1" onPress={() => toast?.close(id)}>
          <Icon as={CloseIcon} color="$coolGray50" />
        </Pressable>
      ) : null}
    </Toast>
  );
}
