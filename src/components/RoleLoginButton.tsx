import React from 'react';
import {Pressable, StyleSheet, useWindowDimensions} from 'react-native';
import ScriptText from './ScriptText';
import {colors} from '../theme/colors';
import {UserRole} from '../types/navigation';

type RoleLoginButtonProps = {
  role: UserRole;
  inverse?: boolean;
  onPress: () => void;
};

function RoleLoginButton({role, inverse = false, onPress}: RoleLoginButtonProps): React.JSX.Element {
  const {width} = useWindowDimensions();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        inverse ? styles.outlineButton : styles.filledButton,
        pressed && styles.pressed,
      ]}>
      <ScriptText
        variant="button"
        style={[
          inverse ? styles.outlineLabel : styles.filledLabel,
          {fontSize: Math.max(18, Math.min(width * 0.038, 26))},
        ]}>
        {role} Login
      </ScriptText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    minHeight: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  filledButton: {
    backgroundColor: colors.text,
  },
  outlineButton: {
    borderColor: colors.text,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  filledLabel: {
    color: colors.background,
  },
  outlineLabel: {
    color: colors.text,
  },
  pressed: {
    opacity: 0.75,
  },
});

export default RoleLoginButton;
