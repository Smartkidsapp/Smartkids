import React, { useCallback, useState } from 'react';
import { Pressable, useToast } from '@gluestack-ui/themed';
import { useUpdateProfilePictureMutation } from './store/user.apiSlice';
import { ActivityIndicator } from 'react-native';
import BaseToast from '../../../components/BaseToast';
import { handleApiError } from '../../utils/error.util';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../constants/Colors';
import CustomBottomSheet from '../../../components/CustomBottomSheet';
import ImagePickerSheet from '../../../components/ImagePickerSheet';

export default function UpdateProfilePicture() {
  const toast = useToast();

  const [udpateProfilePicture, { isLoading }] = useUpdateProfilePictureMutation();

  const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);

  const toggleBottomSheet = () => {
      setBottomSheetOpen(!isBottomSheetOpen);
  };

  const onCloseBottomSheet = () => {
      setBottomSheetOpen(false);
  };

  const uploadPhoto = useCallback(
    (file: { name: string; type: string; uri: string }) => {
      udpateProfilePicture(file).then(res => {
        if ('data' in res && res.data) {
          if (res.data.message) {
            toast.show({
              placement: 'top',
              render: () => (
                <BaseToast bg="$primary" description={res.data.message} />
              ),
            });
          }

          return;
        }

        if ('error' in res && res.error) {
          handleApiError({
            error: res.error,
            toast,
          });
        }
      });
    },
    [udpateProfilePicture, toast],
  );

  return (
    <Pressable
      position="absolute"
      bottom={-10}
      right={0}
      zIndex={10}
      onPress={toggleBottomSheet}>
      {isLoading ? (
        <ActivityIndicator size="small" color="rgba(253, 123, 45, 1)" />
      ) : (
        <Ionicons name='add-circle' color={Colors.light.primary} size={28} />
      )}
      <CustomBottomSheet isOpen={isBottomSheetOpen} onClose={onCloseBottomSheet} title='Choisissez votre photo'>
          <ImagePickerSheet onFilePicked={(file) => uploadPhoto(file)}  />
      </CustomBottomSheet>
    </Pressable>
  );
}
