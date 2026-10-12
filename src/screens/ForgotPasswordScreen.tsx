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
import * as api from '../lib/api';
import {fontFamily} from '../theme/typography';
import {UserRole} from '../types/navigation';

type ForgotPasswordScreenProps = {
  role: UserRole;
  onBack: () => void;
  onSuccess: () => Promise<void>;
};

function ForgotPasswordScreen({
  role,
  onBack,
  onSuccess,
}: ForgotPasswordScreenProps): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [codeVerified, setCodeVerified] = useState(false);
  const [busy, setBusy] = useState(false);

  const sendCode = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      Alert.alert('Email required', 'Enter the email address linked to your account.');
      return;
    }

    setBusy(true);
    try {
      const result = await api.requestRecoveryCode(normalizedEmail);
      setEmail(normalizedEmail);
      setDevOtp(result.dev_otp ?? null);
      setCode(result.dev_otp ?? '');
      setCodeSent(true);
      if (!result.dev_otp) {
        Alert.alert('Check your email', 'Enter the password recovery code sent to your email.');
      }
    } catch (error) {
      Alert.alert(
        'Unable to send code',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async () => {
    const normalizedCode = code.trim();
    if (!normalizedCode) {
      Alert.alert('Code required', 'Enter the recovery code from your email.');
      return;
    }

    setBusy(true);
    try {
      await api.verifyRecoveryCode(email, normalizedCode);
      setCodeVerified(true);
    } catch (error) {
      Alert.alert(
        'Code verification failed',
        error instanceof Error ? error.message : 'Please request a new code and try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  const resetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Password required', 'Enter and confirm your new password.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Password too short', 'Your password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Enter the same new password in both fields.');
      return;
    }

    setBusy(true);
    try {
      await api.updateCurrentUser({password});
      await onSuccess();
    } catch (error) {
      Alert.alert(
        'Unable to reset password',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  const title = role === 'Admin' ? 'Reset Admin Password' : 'Reset Password';
  const buttonLabel = busy
    ? 'Please wait...'
    : codeVerified
      ? 'Set New Password'
      : codeSent
        ? 'Verify Code'
        : 'Send Recovery Code';
  const handleSubmit = codeVerified ? resetPassword : codeSent ? verifyCode : sendCode;

  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.screenFrame}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>
              {codeVerified
                ? 'Choose a new password for your account.'
                : codeSent
                  ? devOtp
                    ? 'This staging API does not send recovery emails. Use the code displayed below.'
                    : `Enter the recovery code sent to ${email}.`
                  : 'Enter your account email and we will send you a recovery code.'}
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                accessibilityLabel="Email Address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!codeSent && !busy}
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="Enter your account email"
                placeholderTextColor="#9EA7BC"
                style={[styles.input, codeSent && styles.disabledInput]}
                value={email}
              />
            </View>

            {codeSent && !codeVerified ? (
              <>
                {devOtp ? (
                  <Text accessibilityRole="text" style={styles.recoveryCodeMessage}>
                    Staging recovery code: {devOtp}
                  </Text>
                ) : null}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Recovery Code</Text>
                  <TextInput
                    accessibilityLabel="Recovery Code"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!busy}
                    keyboardType="number-pad"
                    onChangeText={setCode}
                    placeholder={devOtp ? 'Code entered above' : 'Enter the code from your email'}
                    placeholderTextColor="#9EA7BC"
                    style={styles.input}
                    value={code}
                  />
                </View>
              </>
            ) : null}

            {codeVerified ? (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>New Password</Text>
                  <PasswordInput
                    accessibilityLabel="New Password"
                    editable={!busy}
                    onChangeText={setPassword}
                    placeholder="Enter a new password"
                    placeholderTextColor="#9EA7BC"
                    value={password}
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Confirm New Password</Text>
                  <PasswordInput
                    accessibilityLabel="Confirm New Password"
                    editable={!busy}
                    onChangeText={setConfirmPassword}
                    placeholder="Re-enter your new password"
                    placeholderTextColor="#9EA7BC"
                    value={confirmPassword}
                  />
                </View>
              </>
            ) : null}

            <Pressable
              accessibilityRole="button"
              disabled={busy}
              onPress={() => void handleSubmit()}
              style={({pressed}) => [
                styles.submitButton,
                pressed && styles.pressed,
                busy && styles.disabledButton,
              ]}>
              <Text style={styles.submitLabel}>{buttonLabel}</Text>
            </Pressable>

            {codeSent && !codeVerified ? (
              <Pressable
                accessibilityRole="button"
                disabled={busy}
                onPress={() => void sendCode()}
                style={styles.resendLink}>
                <Text style={styles.linkText}>Resend code</Text>
              </Pressable>
            ) : null}

            <Pressable accessibilityRole="button" onPress={onBack} style={styles.backLink}>
              <Text style={styles.linkText}>Back to login</Text>
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
    paddingTop: 32,
    paddingBottom: 24,
    backgroundColor: '#F5F5F5',
  },
  title: {
    color: '#1B1B1B',
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily,
  },
  subtitle: {
    color: '#202020',
    fontSize: 17,
    lineHeight: 25,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontFamily,
  },
  fieldGroup: {
    marginTop: 18,
  },
  recoveryCodeMessage: {
    marginTop: 18,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#E2EDFF',
    color: '#0E4A9F',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
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
  disabledInput: {
    color: '#777777',
  },
  submitButton: {
    minHeight: 56,
    marginTop: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E4A9F',
  },
  submitLabel: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    fontFamily,
  },
  pressed: {
    opacity: 0.9,
  },
  disabledButton: {
    opacity: 0.65,
  },
  resendLink: {
    alignSelf: 'center',
    paddingVertical: 10,
  },
  backLink: {
    alignSelf: 'center',
    paddingVertical: 10,
    marginTop: 8,
  },
  linkText: {
    color: '#0E4A9F',
    fontSize: 17,
    fontWeight: '600',
    fontFamily,
  },
});

export default ForgotPasswordScreen;
