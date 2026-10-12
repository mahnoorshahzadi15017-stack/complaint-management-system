import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/colors';

type LoadingIndicatorProps = {
  compact?: boolean;
};

function LoadingIndicator({compact = false}: LoadingIndicatorProps): React.JSX.Element {
  return (
    <View style={[styles.container, compact && styles.compactContainer]} accessibilityLiveRegion="polite">
      <ActivityIndicator color={colors.accent} size="large" />
      <Text style={[styles.label, compact && styles.compactLabel]}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 10,
  },
  compactContainer: {
    gap: 4,
  },
  label: {
    color: colors.text,
    fontSize: 15,
    letterSpacing: 0.6,
  },
  compactLabel: {
    fontSize: 13,
  },
});

export default LoadingIndicator;
