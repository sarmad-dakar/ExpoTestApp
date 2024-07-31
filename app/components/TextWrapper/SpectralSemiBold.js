import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import TextWrapper from '.';
import {colors} from '../../utils/theme';

const SpectralSemiBold = props => {
  return (
    <TextWrapper {...props} style={[styles.font, props?.style]}>
      {props.children}
    </TextWrapper>
  );
};

export default SpectralSemiBold;

const styles = StyleSheet.create({
  font: {
    fontFamily: 'SpectralSC-SemiBold',
    color: colors.headingColor,
    letterSpacing: -0.2,
    fontSize: 25,
  },
});
