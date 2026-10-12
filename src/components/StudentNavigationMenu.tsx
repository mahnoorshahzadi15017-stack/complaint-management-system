import React, {useState} from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import AppIcon from './AppIcon';

export type StudentDestination = 'dashboard' | 'profile' | 'myComplaints' | 'newComplaint' | 'logout';

type StudentNavigationMenuProps = {
  onNavigate: (destination: StudentDestination) => void;
};

const destinations: {label: string; destination: StudentDestination}[] = [
  {label: 'Dashboard', destination: 'dashboard'},
  {label: 'My Profile', destination: 'profile'},
  {label: 'My Complaints', destination: 'myComplaints'},
  {label: 'Create Complaint', destination: 'newComplaint'},
  {label: 'Log Out', destination: 'logout'},
];

function StudentNavigationMenu({onNavigate}: StudentNavigationMenuProps): React.JSX.Element {
  const [visible, setVisible] = useState(false);

  const handleNavigate = (destination: StudentDestination) => {
    setVisible(false);
    onNavigate(destination);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open student navigation menu"
        onPress={() => setVisible(true)}
        style={styles.menuButton}>
        <AppIcon name="menu" size={26} />
      </Pressable>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <View style={styles.menuCard}>
            <Text style={styles.menuTitle}>Student Menu</Text>
            {destinations.map(item => (
              <Pressable
                key={item.destination}
                accessibilityRole="button"
                onPress={() => handleNavigate(item.destination)}
                style={styles.menuItem}>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    width: 38,
    height: 38,
    marginLeft: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 58,
    paddingRight: 16,
  },
  menuCard: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 6,
  },
  menuTitle: {
    color: '#111111',
    fontSize: 22,
    fontWeight: '700',
    paddingVertical: 10,
  },
  menuItem: {paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E6E6E6'},
  menuLabel: {color: '#222222', fontSize: 17},
});

export default StudentNavigationMenu;
