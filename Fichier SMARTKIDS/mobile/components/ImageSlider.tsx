import Colors from '@/constants/Colors';
import { Media } from '@/src/types';
import { Image } from '@gluestack-ui/themed';
import { Pressable } from '@gluestack-ui/themed';
import React from 'react';
import { View,  StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';

type SliderDetailProps = {
  couverture?: string | null;
  images: Media[];
  setIndex: (index: number) => void;
  setVisible: (visible: boolean) => void;
}

const ImageSlider = ({ images, couverture, setIndex, setVisible }: SliderDetailProps) => {
  return (
    <>
      {
        images.length > 1 ?
          <Swiper dotColor='#000'
            activeDotColor={Colors.light.primary}
            showsButtons={false}
            loop={true}
            style={{ height: '100%' }}
          >
            {
              images?.map((image, key) => {
                return (
                  <Pressable onPress={() => { setIndex(key); setVisible(true) }} key={key} style={styles.slide}>
                    <Image alt='image' source={{uri: image.src}} style={styles.image} />
                  </Pressable>
                )
              })
            }
          </Swiper>
          :
          <>
            {
              couverture && (
                <Pressable onPress={() => { setIndex(0); setVisible(true) }} style={styles.slide}>
                  <Image alt='image' source={{uri: images[0]?.src}} style={styles.image} />
                </Pressable>
              )
            }
          </>
      }
    </>
  );
};

const styles = StyleSheet.create({

  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 40,
  },
});

export default ImageSlider;
