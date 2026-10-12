import React, {useEffect, useState} from 'react';
import {Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import AppIcon from '../components/AppIcon';
import StudentNavigationMenu, {StudentDestination} from '../components/StudentNavigationMenu';
import * as api from '../lib/api';
import {fontFamily} from '../theme/typography';
import {launchImageLibrary} from 'react-native-image-picker';
import {ApiUser} from '../lib/api';

type ProfileScreenProps = {
  onNavigate: (destination: StudentDestination) => void;
  onBack: () => void;
  onLogout: () => void;
  onProfileSaved: (user: ApiUser) => void;
};

function ProfileScreen({
  onNavigate,
  onBack,
  onLogout,
  onProfileSaved,
}: ProfileScreenProps): React.JSX.Element {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const user = await api.getCurrentUser();
        if (!active) {
          return;
        }

        setName(typeof user.user_metadata.full_name === 'string' ? user.user_metadata.full_name : '');
        setEmail(user.email ?? '');
        setCollege(typeof user.user_metadata.college === 'string' ? user.user_metadata.college : '');
        setDepartment(
          typeof user.user_metadata.department === 'string' ? user.user_metadata.department : '',
        );
        setPhotoUri(user.user_metadata.avatar_url ?? null);
      } catch (error) {
        Alert.alert(
          'Unable to load profile',
          error instanceof Error ? error.message : 'Please try again.',
        );
      }
    };

    void loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const handleAddPicture = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.errorCode) {
        throw new Error(result.errorMessage ?? 'The image could not be selected.');
      }

      const asset = result.assets?.[0];
      const selectedImage = asset?.uri;
      if (selectedImage) {
        setBusy(true);
        const fileName = asset.fileName ?? selectedImage.split('/').pop() ?? 'avatar.jpg';
        setPhotoUri(await api.uploadAvatar(selectedImage, fileName));
      }
    } catch (error) {
      Alert.alert(
        'Unable to update profile photo',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  const handleSaveProfile = async () => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedName || !normalizedEmail) {
      Alert.alert('Missing details', 'Full name and email address are required.');
      return;
    }
    setBusy(true);
    try {
      const currentUser = await api.getCurrentUser();
      const profileUpdates = {
        full_name: normalizedName,
        college: college.trim(),
        department: department.trim(),
      };
      await api.updateCurrentUser({
        ...(normalizedEmail !== currentUser.email ? {email: normalizedEmail} : {}),
        data: profileUpdates,
      });
      onProfileSaved(await api.getCurrentUser());

      Alert.alert('Profile saved', 'Your profile information was updated.');
    } catch (error) {
      Alert.alert(
        'Unable to save profile',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.headerRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to dashboard"
          onPress={onBack}
          style={styles.backButton}>
          <AppIcon name="chevronLeft" size={24} />
        </Pressable>
        <StudentNavigationMenu onNavigate={onNavigate} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>My Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrapper}>
              {photoUri ? (
                <Image source={{uri: photoUri}} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{name.trim().charAt(0).toUpperCase() || 'S'}</Text>
                </View>
              )}
              <Pressable accessibilityRole="button" onPress={handleAddPicture} style={styles.addPictureButton}>
                <AppIcon name="plus" size={18} color="#FFFFFF" />
              </Pressable>
            </View>

            <View style={styles.profileMeta}>
              <Text style={styles.nameText}>{name || 'Your name'}</Text>
              <Text style={styles.roleText}>Student</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>EMAIL</Text>
            <Text style={styles.value}>{email || 'Add your email'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>COLLEGE</Text>
            <Text style={styles.value}>{college || 'Add your college'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>DEPARTMENT</Text>
            <Text style={styles.value}>{department || 'Add your department'}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Profile Information</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Full Name</Text>
          <TextInput
            accessibilityLabel="Full Name"
            autoCapitalize="words"
            onChangeText={setName}
            placeholder="Enter your full name"
            placeholderTextColor="#777777"
            style={styles.input}
            value={name}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Email Address</Text>
          <TextInput
            accessibilityLabel="Email Address"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#777777"
            style={styles.input}
            value={email}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>College</Text>
          <TextInput
            accessibilityLabel="College"
            onChangeText={setCollege}
            placeholder="Enter your college"
            placeholderTextColor="#777777"
            style={styles.input}
            value={college}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Department</Text>
          <TextInput
            accessibilityLabel="Department"
            onChangeText={setDepartment}
            placeholder="Enter your department"
            placeholderTextColor="#777777"
            style={styles.input}
            value={department}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={busy}
          onPress={() => void handleSaveProfile()}
          style={({pressed}) => [styles.saveButton, pressed && styles.pressed, busy && styles.disabled]}>
          <Text style={styles.saveButtonLabel}>{busy ? 'Saving...' : 'Save Changes'}</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          disabled={busy}
          onPress={onLogout}
          style={styles.logoutButton}>
          <Text style={styles.logoutButtonLabel}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  pageTitle: {
    fontSize: 40,
    color: '#111111',
    marginTop: 18,
    marginBottom: 18,
    fontFamily,
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    backgroundColor: '#F2F2F2',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 18,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0E4C9E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 52,
    fontFamily,
    lineHeight: 52,
  },
  addPictureButton: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0E4C9E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F5F5F5',
  },
  profileMeta: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 26,
    color: '#111111',
    fontFamily,
    marginBottom: 4,
  },
  roleText: {
    fontSize: 24,
    color: '#111111',
    fontFamily,
  },
  infoRow: {
    borderTopWidth: 1,
    borderTopColor: '#D2D2D2',
    paddingTop: 12,
    marginTop: 12,
  },
  label: {
    fontSize: 18,
    color: '#111111',
    letterSpacing: 1,
    fontFamily,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    color: '#111111',
    fontFamily,
  },
  sectionTitle: {
    fontSize: 38,
    color: '#111111',
    marginBottom: 16,
    fontFamily,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 22,
    color: '#111111',
    fontFamily,
    marginBottom: 8,
  },
  input: {
    minHeight: 54,
    borderRadius: 10,
    backgroundColor: '#EDEDED',
    borderWidth: 1,
    borderColor: '#D5D5D5',
    paddingHorizontal: 14,
    fontSize: 18,
    color: '#111111',
    fontFamily,
  },
  saveButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#0E4C9E',
    marginTop: 4,
    marginBottom: 8,
  },
  saveButtonLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily,
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.65,
  },
  logoutButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#B3261E',
    marginTop: 14,
    marginBottom: 18,
  },
  logoutButtonLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default ProfileScreen;
