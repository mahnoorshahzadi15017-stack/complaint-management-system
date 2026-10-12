import React from 'react';
import {SafeAreaView, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import BrandMark from '../components/BrandMark';
import CampusIllustration from '../components/CampusIllustration';
import LoadingIndicator from '../components/LoadingIndicator';
import {colors} from '../theme/colors';

function SplashScreen(): React.JSX.Element {
  const {width, height} = useWindowDimensions();
  const compact = height < 700;
  const markSize = Math.min(width * 0.43, height * (compact ? 0.19 : 0.21), 230);
  const campusHeight = Math.min(height * (compact ? 0.12 : 0.15), 125);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.brand}>
          <BrandMark size={markSize} />
          <Text style={[styles.title, compact && styles.compactTitle]}>
            SMART COMPLAINT
            {'\n'}SYSTEM
          </Text>
          <View style={[styles.divider, compact && styles.compactDivider]} accessibilityElementsHidden>
            <View style={styles.dividerLine} />
            <View style={styles.dividerDot} />
            <View style={styles.dividerLine} />
          </View>
          <Text style={[styles.subtitle, compact && styles.compactSubtitle]}>
            Efficient complaint management for
            {'\n'}educational institutions
          </Text>
        </View>
        <View style={styles.campus}>
          <CampusIllustration height={campusHeight} />
        </View>
        <View style={[styles.loading, compact && styles.compactLoading]}>
          <LoadingIndicator compact={compact} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.background,
  },
  brand: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    marginTop: 22,
    color: colors.text,
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: 0.5,
    lineHeight: 34,
    textAlign: 'center',
  },
  compactTitle: {
    marginTop: 8,
    fontSize: 23,
    lineHeight: 29,
  },
  divider: {
    width: 168,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  compactDivider: {
    marginTop: 14,
  },
  dividerLine: {
    width: 70,
    height: 1,
    backgroundColor: colors.track,
  },
  dividerDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  subtitle: {
    marginTop: 22,
    color: colors.text,
    fontSize: 16,
    letterSpacing: 0.8,
    lineHeight: 26,
    textAlign: 'center',
  },
  compactSubtitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
  },
  campus: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  loading: {
    minHeight: 112,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundBottom,
  },
  compactLoading: {
    minHeight: 76,
  },
});

export default SplashScreen;
