import React from 'react';
import { useToast } from '@gluestack-ui/themed';
import { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import BaseToast from '../../components/BaseToast';

export function handleApiError<T extends FieldValues>({
  defaultMsg = 'Une erreur est survenue, veuillez réessayer.',
  error,
  toast,
  setFormError,
}: {
  error: any;
  defaultMsg?: string;
  toast?: ReturnType<typeof useToast>;
  setFormError?: UseFormSetError<T>;
}) {
  console.log(
    'handleApiError',
    JSON.stringify(
      {
        error,
        messageStr: typeof error?.data?.message === 'string',
        msgArray: Array.isArray(error?.data?.message),
      },
      null,
      2,
    ),
  );

  if (error?.status === 'FETCH_ERROR') {
    /*
    toast?.show({
      placement: 'top',
      render: () => (
        <BaseToast
          bg="rgba(226, 3, 29, 1)"
          description={
            'Veuillez vérifier votre connection internet puis réessayer'
          }
        />
      ),
    });
    */

    return;
  }

  if (typeof error?.data?.message === 'string') {
    toast?.show({
      placement: 'top',
      render: () => (
        <BaseToast
          bg="rgba(226, 3, 29, 1)"
          description={error?.data?.message}
        />
      ),
    });
  }

  if (error?.data?.errors) {
    for (const key in error?.data?.errors) {
      if (Object.prototype.hasOwnProperty.call(error?.data.errors, key)) {
        const errors = error?.data.errors[key] as string[];
        setFormError?.(key as Path<T>, {
          message: errors.join('\n'),
        });
      }
    }

    return;
  }

  toast?.show({
    placement: 'top',
    render: () => (
      <BaseToast bg="rgba(226, 3, 29, 1)" description={defaultMsg} />
    ),
  });
}
