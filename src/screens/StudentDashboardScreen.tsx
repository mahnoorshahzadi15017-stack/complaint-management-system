import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import AppIcon from '../components/AppIcon';
import StudentNavigationMenu, {StudentDestination} from '../components/StudentNavigationMenu';
import {colors} from '../theme/colors';
import {fontFamily} from '../theme/typography';
import {Complaint, ComplaintStatus} from '../types/complaint';

type StudentDashboardScreenProps = {
  complaints: Complaint[];
  onNavigate: (destination: StudentDestination) => void;
  onShowComplaints: (status: ComplaintStatus | 'All') => void;
};

function StudentDashboardScreen({
  complaints,
  onNavigate,
  onShowComplaints,
}: StudentDashboardScreenProps): React.JSX.Element {
  return (
    <View style={styles.safeArea}>
      <View style={styles.headerRow}>
        <StudentNavigationMenu onNavigate={onNavigate} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Dashboard</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Show all complaints"
          onPress={() => onShowComplaints('All')}
          style={styles.cardRow}>
          <View style={styles.metricTextBlock}>
            <Text style={styles.metricLabel}>Total Complaints</Text>
            <Text style={styles.metricValue}>{complaints.length}</Text>
          </View>

          <View style={styles.iconTileBlue}>
            <AppIcon name="document" size={27} color="#FFFFFF" />
          </View>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Show pending complaints"
          onPress={() => onShowComplaints('Pending')}
          style={styles.cardRow}>
          <View style={styles.metricTextBlock}>
            <Text style={styles.metricLabel}>Pending</Text>
            <Text style={styles.metricValue}>{complaints.filter(item => item.status === 'Pending').length}</Text>
          </View>

          <View style={styles.iconTileYellow}>
            <AppIcon name="clock" size={27} color="#FFFFFF" />
          </View>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Show in progress complaints"
          onPress={() => onShowComplaints('In Progress')}
          style={styles.cardRow}>
          <View style={styles.metricTextBlock}>
            <Text style={styles.metricLabel}>In Progress</Text>
            <Text style={styles.metricValue}>
              {complaints.filter(item => item.status === 'In Progress').length}
            </Text>
          </View>

          <View style={styles.iconTileBlue}>
            <AppIcon name="refresh" size={27} color="#FFFFFF" />
          </View>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Show resolved complaints"
          onPress={() => onShowComplaints('Resolved')}
          style={styles.cardRow}>
          <View style={styles.metricTextBlock}>
            <Text style={styles.metricLabel}>Resolved</Text>
            <Text style={styles.metricValue}>
              {complaints.filter(item => item.status === 'Resolved').length}
            </Text>
          </View>

          <View style={styles.iconTileGreen}>
            <AppIcon name="check" size={27} color="#FFFFFF" />
          </View>
        </Pressable>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Recent Complaints</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => onNavigate('myComplaints')}
            style={styles.viewAllButton}>
            <Text style={styles.viewAllLabel}>View all</Text>
          </Pressable>
        </View>

        {complaints.slice(0, 2).map((item, index) => (
          <View key={item.id} style={styles.complaintItem}>
            <Text style={styles.complaintTitle}>{item.title}</Text>
            <Text style={styles.complaintDescription}>{item.description}</Text>
            {index === 1 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Create a complaint"
                onPress={() => onNavigate('myComplaints')}
                style={styles.actionButton}>
                <AppIcon name="plus" size={22} color="#FFFFFF" />
              </Pressable>
            ) : null}
          </View>
        ))}
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
    paddingBottom: 28,
  },
  pageTitle: {
    fontSize: 34,
    color: '#111111',
    marginTop: 18,
    marginBottom: 18,
    fontFamily,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F0F0',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  metricTextBlock: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 18,
    color: '#111111',
    fontFamily,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 32,
    color: '#111111',
    fontFamily,
    lineHeight: 38,
  },
  iconTileBlue: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#0E4C9E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTileYellow: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#E3B12B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTileGreen: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#22B573',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 34,
    color: '#111111',
    marginTop: 18,
    marginBottom: 4,
    fontFamily,
  },
  sectionHeading: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  viewAllButton: {
    paddingVertical: 4,
  },
  viewAllLabel: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '600',
  },
  complaintItem: {
    backgroundColor: '#F3F3F3',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#D6D6D6',
  },
  complaintTitle: {
    fontSize: 20,
    color: '#111111',
    fontFamily,
    marginBottom: 6,
  },
  complaintDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#2F2F2F',
    fontFamily,
    maxWidth: '90%',
  },
  actionButton: {
    position: 'absolute',
    right: 16,
    bottom: 14,
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#0E4C9E',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StudentDashboardScreen;
