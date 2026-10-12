import React, {useState} from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Asset, ImagePickerResponse, launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AppIcon from '../components/AppIcon';
import StudentNavigationMenu, {StudentDestination} from '../components/StudentNavigationMenu';
import {fontFamily} from '../theme/typography';
import {ComplaintPriority, NewComplaint} from '../types/complaint';

const collegeOptions = ['Engineering', 'Business'];
const departmentOptions = ['CSE', 'Electrical', 'Mechanical', 'Civil', 'Administration'];
const categoryOptions = ['Academic', 'Administration', 'Hostel', 'Infrastructure'];

type FormSelection = 'college' | 'department' | 'category';

const selectionOptions: Record<FormSelection, string[]> = {
  college: collegeOptions,
  department: departmentOptions,
  category: categoryOptions,
};

type CreateComplaintScreenProps = {
  onNavigate: (destination: StudentDestination) => void;
  onSubmit: (complaint: NewComplaint) => Promise<string | null>;
};

function CreateComplaintScreen({onNavigate, onSubmit}: CreateComplaintScreenProps): React.JSX.Element {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [college, setCollege] = useState('Engineering');
  const [department, setDepartment] = useState('');
  const [category, setCategory] = useState('Academic');
  const [priority, setPriority] = useState<ComplaintPriority>('Medium');
  const [selectedImages, setSelectedImages] = useState<NewComplaint['attachments']>([]);
  const [openSelection, setOpenSelection] = useState<FormSelection | null>(null);
  const [busy, setBusy] = useState(false);

  const addPickedAssets = (assets: Asset[]) => {
    const newImages = assets
      .filter((asset): asset is Asset & {uri: string} => Boolean(asset.uri))
      .map((asset, index) => ({
        id: asset.id ?? asset.uri,
        uri: asset.uri,
        fileName:
          asset.fileName ??
          asset.uri.split('/').pop() ??
          `Image ${selectedImages.length + index + 1}`,
      }));

    setSelectedImages(currentImages => {
      const uniqueImages = newImages.filter(
        image => !currentImages.some(existingImage => existingImage.uri === image.uri),
      );
      return [...currentImages, ...uniqueImages].slice(0, 5);
    });
  };

  const showPickerError = (result: ImagePickerResponse) => {
    if (!result.errorCode) {
      return;
    }

    const message =
      result.errorCode === 'permission'
        ? 'Allow camera or photo library access in your device settings, then try again.'
        : result.errorCode === 'camera_unavailable'
          ? 'Camera is not available on this device.'
          : result.errorMessage ?? 'The image could not be selected. Please try again.';

    Alert.alert('Unable to add image', message);
  };

  const handleChooseFiles = async () => {
    if (selectedImages.length >= 5) {
      Alert.alert('Image limit reached', 'You can attach up to 5 images to a complaint.');
      return;
    }

    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 5 - selectedImages.length,
        quality: 0.8,
      });

      showPickerError(result);
      if (!result.didCancel && !result.errorCode) {
        addPickedAssets(result.assets ?? []);
      }
    } catch (error) {
      Alert.alert(
        'Unable to open gallery',
        error instanceof Error ? error.message : 'Please try again.',
      );
    }
  };

  const handleTakePhoto = async () => {
    if (selectedImages.length >= 5) {
      Alert.alert('Image limit reached', 'You can attach up to 5 images to a complaint.');
      return;
    }

    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
      });

      showPickerError(result);
      if (!result.didCancel && !result.errorCode) {
        addPickedAssets(result.assets ?? []);
      }
    } catch (error) {
      Alert.alert(
        'Unable to open camera',
        error instanceof Error ? error.message : 'Please try again.',
      );
    }
  };

  const handleRemoveImage = (imageId: string) => {
    setSelectedImages(currentImages => currentImages.filter(image => image.id !== imageId));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !department) {
      Alert.alert(
        'Missing details',
        'Enter a title and description, and select a department before submitting.',
      );
      return;
    }

    setBusy(true);
    try {
      const attachmentError = await onSubmit({
        title: title.trim(),
        description: description.trim(),
        status: 'Pending',
        college,
        department,
        category,
        priority,
        student: '',
        attachments: selectedImages,
      });
      setTitle('');
      setDescription('');
      setDepartment('');
      setCategory('Academic');
      setPriority('Medium');
      setSelectedImages([]);
      Alert.alert(
        'Complaint submitted',
        attachmentError
          ? `Your complaint was submitted, but an image could not be uploaded: ${attachmentError}`
          : 'Your complaint was submitted and is now pending review.',
      );
    } catch (error) {
      Alert.alert(
        'Unable to submit complaint',
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
          onPress={() => onNavigate('dashboard')}
          style={styles.backButton}>
          <AppIcon name="chevronLeft" size={24} />
        </Pressable>
        <StudentNavigationMenu onNavigate={onNavigate} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Create a New Complaint</Text>

        <Text style={styles.fieldLabel}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Brief title of your complaint"
          placeholderTextColor="#8E8E8E"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.fieldLabel}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Detailed description of your complaint"
          placeholderTextColor="#8E8E8E"
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={5}
          autoCapitalize="sentences"
          autoCorrect={false}
        />

        <Text style={styles.fieldLabel}>College</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setOpenSelection('college')}
          style={styles.selectBox}>
          <Text style={styles.selectText}>{college}</Text>
          <AppIcon name="chevronDown" size={20} />
        </Pressable>

        <Text style={styles.fieldLabel}>Department</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setOpenSelection('department')}
          style={styles.selectBox}>
          <Text style={department ? styles.selectText : styles.selectPlaceholder}>
            {department || 'Select Department'}
          </Text>
          <AppIcon name="chevronDown" size={20} />
        </Pressable>

        <Text style={styles.fieldLabel}>Category</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setOpenSelection('category')}
          style={styles.selectBox}>
          <Text style={styles.selectText}>{category}</Text>
          <AppIcon name="chevronDown" size={20} />
        </Pressable>

        <Text style={styles.fieldLabel}>Priority</Text>
        <View style={styles.priorityRow}>
          {(['Low', 'Medium', 'High'] as ComplaintPriority[]).map(level => {
            const selected = priority === level;
            return (
              <Pressable
                key={level}
                accessibilityRole="radio"
                onPress={() => setPriority(level)}
                style={styles.priorityOption}>
                <View style={[styles.radioCircle, selected && styles.radioCircleSelected]}>
                  {selected ? <View style={styles.radioDot} /> : null}
                </View>
                <Text style={[styles.priorityText, selected && styles.priorityTextSelected]}>{level}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.uploadLabel}>Upload Images (Max 5)</Text>
        <View style={styles.uploadBox}>
          <Pressable accessibilityRole="button" onPress={handleChooseFiles} style={styles.uploadAction}>
            <Text style={styles.uploadButton}>Gallery</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={handleTakePhoto} style={styles.uploadAction}>
            <Text style={styles.uploadButton}>Camera</Text>
          </Pressable>
          <Text style={styles.uploadText}>{selectedImages.length}/5</Text>
        </View>

        {selectedImages.length > 0 ? (
          <View style={styles.imageList}>
            {selectedImages.map(image => (
              <View key={image.id} style={styles.imageItem}>
                <Image source={{uri: image.uri}} style={styles.previewImage} />
                <Text numberOfLines={1} style={styles.imageFileName}>
                  {image.fileName}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${image.fileName}`}
                  onPress={() => handleRemoveImage(image.id)}
                  style={styles.removeImageButton}>
                  <AppIcon name="close" size={16} color="#FFFFFF" />
                </Pressable>
              </View>
            ))}
          </View>
        ) : null}

        <Pressable
          accessibilityRole="button"
          disabled={busy}
          onPress={() => void handleSubmit()}
          style={[styles.submitButton, busy && {opacity: 0.65}]}>
          <Text style={styles.submitText}>{busy ? 'Submitting...' : 'Submit Complaint'}</Text>
        </Pressable>
      </ScrollView>
      <Modal
        visible={openSelection !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenSelection(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setOpenSelection(null)}>
          <View style={styles.optionsCard}>
            <Text style={styles.optionsTitle}>
              {openSelection === 'college'
                ? 'Select College'
                : openSelection === 'department'
                  ? 'Select Department'
                  : 'Select Category'}
            </Text>
            {(openSelection ? selectionOptions[openSelection] : []).map(option => (
              <Pressable
                key={option}
                accessibilityRole="button"
                onPress={() => {
                  if (openSelection === 'college') {
                    setCollege(option);
                  } else if (openSelection === 'department') {
                    setDepartment(option);
                  } else if (openSelection === 'category') {
                    setCategory(option);
                  }
                  setOpenSelection(null);
                }}
                style={styles.optionRow}>
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
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
  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 34,
    color: '#111111',
    marginTop: 18,
    marginBottom: 18,
    fontWeight: '600',
    fontFamily,
  },
  fieldLabel: {
    fontSize: 22,
    color: '#111111',
    marginBottom: 10,
    fontFamily,
  },
  input: {
    minHeight: 56,
    borderRadius: 10,
    backgroundColor: '#EAEAEA',
    borderWidth: 1,
    borderColor: '#D4D4D4',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 20,
    color: '#111111',
    fontFamily,
    marginBottom: 18,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  selectBox: {
    minHeight: 56,
    borderRadius: 10,
    backgroundColor: '#EAEAEA',
    borderWidth: 1,
    borderColor: '#D4D4D4',
    paddingHorizontal: 14,
    paddingRight: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  selectText: {
    fontSize: 22,
    color: '#111111',
    fontFamily,
  },
  selectPlaceholder: {
    fontSize: 22,
    color: '#7A7A7A',
    fontFamily,
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    marginTop: 4,
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#111111',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#0E4C9E',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0E4C9E',
  },
  priorityText: {
    fontSize: 22,
    color: '#111111',
    fontFamily,
  },
  priorityTextSelected: {
    color: '#0E4C9E',
  },
  uploadLabel: {
    fontSize: 22,
    color: '#111111',
    fontFamily,
    marginTop: 8,
    marginBottom: 10,
  },
  uploadBox: {
    minHeight: 66,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#8E8E8E',
    backgroundColor: '#F6F6F6',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 18,
  },
  uploadAction: {
    flex: 1,
  },
  uploadButton: {
    fontSize: 16,
    color: '#111111',
    fontFamily,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#A5A5A5',
    backgroundColor: '#E9E9E9',
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  uploadText: {
    fontSize: 15,
    color: '#7A7A7A',
    fontFamily,
    minWidth: 30,
    textAlign: 'center',
  },
  imageList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  imageItem: {
    width: 82,
    position: 'relative',
  },
  previewImage: {
    width: 82,
    height: 82,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  imageFileName: {
    color: '#333333',
    fontSize: 12,
    marginTop: 4,
  },
  removeImageButton: {
    position: 'absolute',
    top: -7,
    right: -7,
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#B3261E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F5F5F5',
  },
  submitButton: {
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: '#0E4C9E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  optionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  optionsTitle: {
    color: '#111111',
    fontSize: 23,
    fontFamily,
    paddingVertical: 12,
  },
  optionRow: {
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: '#E7E7E7',
  },
  optionText: {
    fontSize: 18,
    color: '#333333',
  },
});

export default CreateComplaintScreen;
