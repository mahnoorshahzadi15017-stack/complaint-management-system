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
import {UserRole} from '../types/navigation';

type LoginScreenProps = {
  role: UserRole;
  onBack: () => void;
  onForgotPassword: () => void;
  onSignUp?: () => void;
  onSuccess: (email: string, password: string) => Promise<void>;
};

function LoginScreen({
  role,
  onBack,
  onForgotPassword,
  onSignUp,
  onSuccess,
}: LoginScreenProps): React.JSX.Element {
  const isAdmin = role === 'Admin';
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const title = isAdmin ? 'Admin Login' : 'Student Login';
  const subtitle = isAdmin ? 'Manage complaints and users' : 'Access the complaint system';
  const placeholder = 'Enter your email';
  const switchText = isAdmin ? 'Student? Login here' : 'Admin? Login here';

  const handleContinue = async () => {
    if (!identity.trim() || !password) {
      Alert.alert('Missing details', 'Enter your email or ID and password to continue.');
      return;
    }

    setBusy(true);
    try {
      await onSuccess(identity.trim(), password);
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
            <View style={[styles.brandCircle, isAdmin && styles.adminCircle]}>
              <Text style={styles.brandLetter}>{isAdmin ? 'A' : 'S'}</Text>
            </View>

            <ScriptText variant="title" style={[styles.title, isAdmin && styles.adminTitle]}>
              {title}
            </ScriptText>
            <ScriptText variant="body" style={[styles.subtitle, isAdmin && styles.adminSubtitle]}>
              {subtitle}
            </ScriptText>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                accessibilityLabel="Email Address"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={setIdentity}
                placeholder={placeholder}
                placeholderTextColor="#9EA7BC"
                style={styles.input}
                value={identity}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <PasswordInput
                accessibilityLabel="Password"
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#9EA7BC"
                value={password}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={onForgotPassword}
              style={styles.forgotPasswordLink}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={busy}
              onPress={handleContinue}
              style={({pressed}) => [styles.submitButton, pressed && styles.pressed, busy && styles.disabled]}>
              <Text style={styles.submitLabel}>{busy ? 'Please wait...' : 'Login'}</Text>
            </Pressable>

            <Pressable accessibilityRole="button" onPress={onBack} style={styles.switchLink}>
              <Text style={styles.switchText}>{switchText}</Text>
            </Pressable>

            {onSignUp ? (
              <Pressable accessibilityRole="button" onPress={onSignUp} style={styles.signUpLink}>
                <Text style={styles.signUpText}>Don't have an account? Sign up</Text>
              </Pressable>
            ) : null}

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
  adminCircle: {
    backgroundColor: '#0F4C9B',
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
  adminTitle: {
    fontSize: 42,
  },
  subtitle: {
    marginTop: 10,
    color: '#202020',
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    fontWeight: '400',
  },
  adminSubtitle: {
    fontSize: 22,
    lineHeight: 32,
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
  switchLink: {
    marginTop: 22,
    paddingVertical: 6,
    alignSelf: 'center',
  },
  switchText: {
    color: '#1B1B1B',
    fontSize: 20,
    fontFamily,
    textAlign: 'center',
  },
  signUpLink: {
    marginTop: 12,
    paddingVertical: 6,
    alignSelf: 'center',
  },
  signUpText: {
    color: '#0E4A9F',
    fontSize: 18,
    fontWeight: '600',
    fontFamily,
    textAlign: 'center',
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    color: '#0E4A9F',
    fontSize: 16,
    fontFamily,
  },
});

export default LoginScreen;
