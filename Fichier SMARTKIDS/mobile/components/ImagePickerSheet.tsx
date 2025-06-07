import {
    Box,
    Center,
    HStack,
    Image,
    Pressable,
    VStack,
} from '@gluestack-ui/themed';
import React, { useEffect } from 'react';
import { StyledText } from './StyledText';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { PermissionsAndroid, Platform } from 'react-native';

export interface FileRecord {
    id?: string; // Use for edit or delete file.
    uri: string;
    type: string;
    size: number;
    name: string;
}

export default function ImagePickerSheet({
    onFilePicked,
}: {
    onFilePicked: (_file: {
        name: string;
        type: string;
        uri: string;
    }) => void
}) {

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Autorisation de la caméra',
                        message: 'Smartkids a besoin de l\'autorisation de l\'appareil photo',
                        buttonPositive: "OK"
                    },
                );
                // If CAMERA Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else return true;
    };

    useEffect(() => {
        requestCameraPermission();
    }, []);

    return (
        <HStack space="sm" px={24} pb={44} pt={32}>
            <Box flex={1} h={150} position="relative">
                <AppCamera onFilePicked={onFilePicked} />
            </Box>
            <Box flex={1} h={150}>
                <GalleryPicker onFilePicked={onFilePicked}
                />
            </Box>
        </HStack>
    );
}

function AppCamera({
    onFilePicked,
}: {
    onFilePicked?: (_file: { name: string; type: string; uri: string }) => void;
}) {
    const handlePress = async () => {
        try {

            const result = await launchCamera({
                mediaType: 'photo',
                cameraType: 'front',
                quality: 0.3,
                saveToPhotos: true,
            });

            if (result.assets?.length) {
                const files: FileRecord[] = result.assets.map(
                    ({ fileSize, uri, type, fileName }) => ({
                        uri: uri!,
                        type: type! ?? 'image/*',
                        name: fileName!,
                        size: fileSize ?? 0,
                    }),
                );
                onFilePicked?.({ ...files[0] });
            }
        } catch (error) { }
    };

    return (
        <Pressable flex={1} onPress={handlePress} backgroundColor='$light100'>
            <Center flex={1} position="relative">
                <StyledText size={14} center weight="semi-bold">
                    Camera
                </StyledText>
                <Ionicons name='camera-outline' size={50} color={Colors.light.primary} />
            </Center>
        </Pressable>
    );
}

function GalleryPicker({
    onFilePicked,
}: {
    onFilePicked?: (_file: { name: string; type: string; uri: string }) => void;
}) {
    const handlePress = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.3,
            });

            if (result.assets?.length) {
                const files: FileRecord[] = result.assets.map(
                    ({ fileSize, uri, type, fileName }) => ({
                        uri: uri!,
                        type: type! ?? 'image/*',
                        name: fileName!,
                        size: fileSize ?? 0,
                    }),
                );
                onFilePicked?.({ ...files[0] });
            }
        } catch (error) { }
    };

    return (
        <Pressable onPress={handlePress} flex={1} backgroundColor='$light100'>
            <Center flex={1} rounded='$full'>
                <VStack space="xs" justifyContent="center" alignItems="center">
                    <StyledText size={14} center weight="semi-bold">
                        Gallerie
                    </StyledText>
                    <Ionicons name='image-outline' size={50} color={Colors.light.primary} />
                </VStack>
            </Center>
        </Pressable>
    );
}
