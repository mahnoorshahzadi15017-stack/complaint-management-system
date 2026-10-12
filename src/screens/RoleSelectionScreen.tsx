import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, useWindowDimensions, View} from 'react-native';
import RoleLoginButton from '../components/RoleLoginButton';
import ScriptText from '../components/ScriptText';
import {colors} from '../theme/colors';
import {UserRole} from '../types/navigation';

type RoleSelectionScreenProps = {
  onSelectRole: (role: UserRole) => void;
};

function RoleSelectionScreen({onSelectRole}: RoleSelectionScreenProps): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 680;
  const titleSize = Math.min(width * 0.087, compact ? 42 : 54);
  const bodySize = Math.min(width * 0.05, compact ? 21 : 32);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.content, {paddingTop: height * (compact ? 0.09 : 0.18)}]}
        bounces={false}>
        <ScriptText variant="title" style={{fontSize: titleSize, lineHeight: titleSize * 1.2}}>
          Smart Complaint
          {'\n'}System
        </ScriptText>
        <ScriptText variant="body" style={[styles.description, {fontSize: bodySize, lineHeight: bodySize * 1.5}]}>
          Efficient complaint management for
          {'\n'}educational institutions
        </ScriptText>
        <View style={[styles.actions, {marginTop: height * (compact ? 0.06 : 0.095)}]}>
          <RoleLoginButton role="Student" onPress={() => onSelectRole('Student')} />
          <RoleLoginButton role="Admin" inverse onPress={() => onSelectRole('Admin')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.roleBackground,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 28,
  },
  description: {
    marginTop: 40,
    color: '#E0E8FA',
  },
  actions: {
    width: '100%',
    maxWidth: 680,
    gap: 28,
  },
});

export default RoleSelectionScreen;
