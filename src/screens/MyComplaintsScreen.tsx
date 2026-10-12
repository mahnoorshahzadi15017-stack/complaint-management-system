import React from 'react';
import {Image, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import AppIcon from '../components/AppIcon';
import StudentNavigationMenu, {StudentDestination} from '../components/StudentNavigationMenu';
import {fontFamily} from '../theme/typography';
import {Complaint, ComplaintStatus} from '../types/complaint';

type MyComplaintsScreenProps = {
  complaints: Complaint[];
  statusFilter: ComplaintStatus | 'All';
  onNavigate: (destination: StudentDestination) => void;
};

const badgeColors: Record<Complaint['status'], string> = {
  New: '#ECE7FA',
  Pending: '#FFF0C2',
  'In Progress': '#DCEBFF',
  Resolved: '#D8F4E2',
};

function MyComplaintsScreen({
  complaints,
  statusFilter,
  onNavigate,
}: MyComplaintsScreenProps): React.JSX.Element {
  const title = statusFilter === 'All' ? 'My Complaints' : `${statusFilter} Complaints`;

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
        <Text style={styles.pageTitle}>{title}</Text>
        <Text style={styles.subtitle}>
          {statusFilter === 'All'
            ? 'Track the status of complaints you have submitted.'
            : `Showing complaints with ${statusFilter.toLowerCase()} status.`}
        </Text>
        {complaints.length > 0 ? (
          complaints.map(complaint => (
            <View key={complaint.id} style={styles.card}>
              <View style={styles.heading}>
                <Text style={styles.title}>{complaint.title}</Text>
                <View style={[styles.badge, {backgroundColor: badgeColors[complaint.status]}]}>
                  <Text style={styles.badgeText}>{complaint.status}</Text>
                </View>
              </View>
              <Text style={styles.description}>{complaint.description}</Text>
              <View style={styles.divider} />
              <Text style={styles.detail}>ID: {complaint.id}</Text>
              <Text style={styles.detail}>
                {complaint.college} · {complaint.department} · {complaint.category}
              </Text>
              <Text style={styles.detail}>
                {complaint.priority} priority · {new Date(complaint.submittedAt).toLocaleDateString()}
              </Text>
              {complaint.attachments.length > 0 ? (
                <View style={styles.attachmentList}>
                  {complaint.attachments.map(attachment => (
                    <Image
                      key={attachment.id}
                      accessibilityLabel={attachment.fileName}
                      source={{uri: attachment.uri}}
                      style={styles.attachmentPreview}
                    />
                  ))}
                </View>
              ) : null}
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              {statusFilter === 'All' ? 'No complaints yet' : `No ${statusFilter.toLowerCase()} complaints`}
            </Text>
            {statusFilter === 'All' ? (
              <>
                <Text style={styles.emptyMessage}>Create a complaint to start tracking its status here.</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => onNavigate('newComplaint')}
                  style={styles.createButton}>
                  <Text style={styles.createButtonLabel}>Create Complaint</Text>
                </Pressable>
              </>
            ) : null}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#F5F5F5'},
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA',
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {flex: 1},
  content: {paddingHorizontal: 20, paddingBottom: 30},
  pageTitle: {
    fontSize: 36,
    color: '#111111',
    marginTop: 18,
    marginBottom: 8,
    fontFamily,
  },
  subtitle: {fontSize: 17, lineHeight: 24, color: '#555555', marginBottom: 18},
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  heading: {flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8},
  title: {
    flex: 1,
    fontSize: 22,
    color: '#111111',
    fontFamily,
  },
  badge: {borderRadius: 10, paddingHorizontal: 9, paddingVertical: 5},
  badgeText: {fontSize: 12, color: '#333333', fontWeight: '600'},
  description: {fontSize: 16, lineHeight: 22, color: '#454545'},
  divider: {height: 1, backgroundColor: '#E5E5E5', marginVertical: 12},
  detail: {fontSize: 14, lineHeight: 21, color: '#555555'},
  attachmentList: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10},
  attachmentPreview: {width: 64, height: 64, borderRadius: 8},
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 22,
    alignItems: 'center',
  },
  emptyTitle: {fontSize: 22, fontWeight: '700', color: '#111111', marginBottom: 8},
  emptyMessage: {fontSize: 16, color: '#555555', textAlign: 'center', lineHeight: 22},
  createButton: {
    backgroundColor: '#0E4C9E',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginTop: 16,
  },
  createButtonLabel: {color: '#FFFFFF', fontSize: 16, fontWeight: '600'},
});

export default MyComplaintsScreen;
