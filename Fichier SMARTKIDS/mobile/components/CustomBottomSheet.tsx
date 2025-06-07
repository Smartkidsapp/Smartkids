import React, { useRef, useMemo, useCallback, useEffect, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { StyledText } from './StyledText';
import { Button, HStack, Pressable } from '@gluestack-ui/themed';

const CustomBottomSheet = ({ customSnapPoints, isOpen, onClose, title, children }: { customSnapPoints?: any[], isOpen: boolean, onClose: () => void, title: string, children: ReactNode }) => {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => customSnapPoints || ['50%', '50%'], []);

  // Handle opening/closing the bottom sheet based on the isOpen prop
  useEffect(() => {
    console.log(isOpen);
    if (isOpen) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.close();
    }
  }, [isOpen]);

  const handleSheetChanges = useCallback((index: number) => {
    if(index == -1) {
      onClose();
    }
  }, []);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.container}>
        <HStack
          alignItems='center'
          w="$full"
          justifyContent='space-between'
          mb={32}
        >
          <Pressable
            position='relative'
            zIndex={1000}
            bgColor='$primary'
            rounded='$full'
            w={28}
            h={28}
            alignSelf='flex-start'
            justifyContent='center'
            alignItems='center'
            onPress={onClose}
          >
            <Ionicons name="close" size={18} color="black" />
          </Pressable>
          <StyledText size={14} weight='semi-bold' style={{ flex: 1, textAlign: 'center', marginLeft: -28, position: 'relative', zIndex: 0 }}>{title}</StyledText>
        </HStack>
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  closeIcon: {
    alignSelf: 'flex-start',
  },
  warningIconContainer: {
    marginBottom: 20,
  },
  attentionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4C4C',
    marginBottom: 10,
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#E6DAC7',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomBottomSheet;
