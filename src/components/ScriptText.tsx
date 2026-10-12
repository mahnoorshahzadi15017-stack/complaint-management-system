import React from 'react';
import {StyleSheet, Text, TextProps} from 'react-native';
import {fontFamily} from '../theme/typography';

type ScriptTextProps = TextProps & {
  variant?: 'title' | 'body' | 'button';
};

function ScriptText({style, variant = 'body', ...props}: ScriptTextProps): React.JSX.Element {
  return <Text {...props} style={[styles.base, styles[variant], style]} />;
}

const styles = StyleSheet.create({
  base: {
    color: '#FFFFFF',
    fontFamily,
    textAlign: 'center',
  },
  title: {
    fontSize: 52,
    fontWeight: '700',
    lineHeight: 64,
  },
  body: {
    fontSize: 25,
    letterSpacing: 0.6,
    lineHeight: 42,
  },
  button: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
});

export default ScriptText;
