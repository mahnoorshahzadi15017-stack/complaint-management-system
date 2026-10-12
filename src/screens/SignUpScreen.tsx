import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import PasswordInput from '../components/PasswordInput';
import ScriptText from '../components/ScriptText';
import {fontFamily} from '../theme/typography';

type SignUpScreenProps = {
  onBack: () => void;
  onSuccess: (name: string, email: string, password: string) => Promise<void>;
};

function SignUpScreen({onBack, onSuccess}: SignUpScreenProps): React.JSX.Element {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Missing details', 'Please complete all fields to continue.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Please enter the same password in both fields.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Password too short', 'Your password must be at least 6 characters.');
      return;
    }

    setBusy(true);
    try {
      await onSuccess(name.trim(), email.trim().toLowerCase(), password);
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.screenFrame}>
          <View style={styles.formContainer}>
            <View style={styles.brandCircle}>
              <Text style={styles.brandLetter}>S</Text>
            </View>

            <ScriptText variant="title" style={styles.title}>
              Student Sign Up
            </ScriptText>
            <ScriptText variant="body" style={styles.subtitle}>
              Create your account to continue
            </ScriptText>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                accessibilityLabel="Full Name"
                autoCapitalize="words"
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor="#9EA7BC"
                style={styles.input}
                value={name}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                accessibilityLabel="Email Address"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#9EA7BC"
                style={styles.input}
                value={email}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <PasswordInput
                accessibilityLabel="Password"
                onChangeText={setPassword}
                placeholder="Create a password"
                placeholderTextColor="#9EA7BC"
                value={password}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <PasswordInput
                accessibilityLabel="Confirm Password"
                onChangeText={setConfirmPassword}
                placeholder="Re-enter your password"
                placeholderTextColor="#9EA7BC"
                value={confirmPassword}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              disabled={busy}
              onPress={() => void handleSignUp()}
              style={({pressed}) => [styles.submitButton, pressed && styles.pressed, busy && styles.disabled]}>
              <Text style={styles.submitLabel}>{busy ? 'Please wait...' : 'Sign Up'}</Text>
            </Pressable>

            <Pressable accessibilityRole="button" onPress={onBack} style={styles.loginLink}>
              <Text style={styles.loginText}>Already have an account? Login</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  content: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  screenFrame: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  formContainer: {
    width: '92%',
    maxWidth: 460,
    alignSelf: 'center',
    marginTop: 16,
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 18,
    backgroundColor: '#F5F5F5',
  },
  brandCircle: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: '#0F4C9B',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 18,
  },
  brandLetter: {
    fontSize: 68,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 68,
    fontFamily,
  },
  title: {
    fontSize: 42,
    lineHeight: 54,
    color: '#1B1B1B',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    color: '#202020',
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    fontWeight: '400',
  },
  fieldGroup: {
    marginTop: 18,
  },
  label: {
    marginBottom: 8,
    color: '#221F1F',
    fontSize: 18,
    fontFamily,
  },
  input: {
    minHeight: 54,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#1C2A3A',
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#B9C0CC',
    borderRadius: 8,
    fontFamily,
  },
  submitButton: {
    minHeight: 62,
    marginTop: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E4A9F',
  },
  submitLabel: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '700',
    fontFamily,
    lineHeight: 32,
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.65,
  },
  loginLink: {
    marginTop: 18,
    paddingVertical: 6,
    alignSelf: 'center',
  },
  loginText: {
    color: '#0E4A9F',
    fontSize: 18,
    fontWeight: '600',
    fontFamily,
    textAlign: 'center',
  },
});

export default SignUpScreen;
