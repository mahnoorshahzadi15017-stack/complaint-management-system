import React, {useState} from 'react';
import {Pressable, StyleSheet, TextInput, TextInputProps, View} from 'react-native';
import AppIcon from './AppIcon';
import {fontFamily} from '../theme/typography';

type PasswordInputProps = Pick<
  TextInputProps,
  'accessibilityLabel' | 'editable' | 'onChangeText' | 'placeholder' | 'placeholderTextColor' | 'value'
>;

function PasswordInput(props: PasswordInputProps): React.JSX.Element {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={!visible}
        style={styles.input}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        onPress={() => setVisible(current => !current)}
        style={styles.visibilityButton}>
        <AppIcon name={visible ? 'eyeOff' : 'eye'} size={22} color="#555555" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#B9C0CC',
    borderRadius: 8,
  },
  input: {
    flex: 1,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingRight: 4,
    fontSize: 16,
    color: '#1C2A3A',
    fontFamily,
  },
  visibilityButton: {
    minWidth: 48,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PasswordInput;
