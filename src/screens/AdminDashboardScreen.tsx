import React, {useMemo, useState} from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AppIcon from '../components/AppIcon';
import {colors} from '../theme/colors';
import {fontFamily} from '../theme/typography';
import {Complaint, ComplaintStatus} from '../types/complaint';
type FilterKind = 'status' | 'college';

const statusOptions = ['All Status', 'Pending', 'In Progress', 'Resolved', 'New'];

type AdminDashboardScreenProps = {
  complaints: Complaint[];
  onStatusChange: (complaintId: string, status: ComplaintStatus) => void;
  onLogout: () => void;
};

function AdminDashboardScreen({
  complaints,
  onStatusChange,
  onLogout,
}: AdminDashboardScreenProps): React.JSX.Element {
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [collegeFilter, setCollegeFilter] = useState('All Colleges');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFilter, setOpenFilter] = useState<FilterKind | null>(null);
  const [expandedComplaint, setExpandedComplaint] = useState<string | null>(null);
  const [adminMenuVisible, setAdminMenuVisible] = useState(false);
  const [statusComplaintId, setStatusComplaintId] = useState<string | null>(null);
  const collegeOptions = ['All Colleges', ...Array.from(new Set(complaints.map(item => item.college)))];

  const filteredComplaints = useMemo(
    () =>
      complaints.filter(
        complaint => {
          const query = searchQuery.trim().toLowerCase();
          const matchesSearch =
            query.length === 0 ||
            [
              complaint.id,
              complaint.title,
              complaint.description,
              complaint.status,
              complaint.student,
              complaint.college,
              complaint.department,
              complaint.category,
            ].some(value => value.toLowerCase().includes(query));

          return (
            matchesSearch &&
          (statusFilter === 'All Status' || complaint.status === statusFilter) &&
              (collegeFilter === 'All Colleges' || complaint.college === collegeFilter)
          );
        },
      ),
    [collegeFilter, complaints, searchQuery, statusFilter],
  );

  const options = openFilter === 'status' ? statusOptions : collegeOptions;
  const filterValue = openFilter === 'status' ? statusFilter : collegeFilter;

  const chooseFilter = (value: string) => {
    if (openFilter === 'status') {
      setStatusFilter(value);
    } else if (openFilter === 'college') {
      setCollegeFilter(value);
    }
    setOpenFilter(null);
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.headerRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open admin menu"
          onPress={() => setAdminMenuVisible(true)}
          style={styles.menuButton}>
          <AppIcon name="menu" size={26} />
        </Pressable>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Admin Dashboard</Text>

        <View style={styles.metricCard}>
          <View>
            <Text style={styles.metricLabel}>Total Complaints</Text>
            <Text style={styles.metricValue}>{complaints.length}</Text>
          </View>
          <View style={styles.iconTileBlue}>
            <AppIcon name="document" size={30} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.metricCard}>
          <View>
            <Text style={styles.metricLabel}>Pending</Text>
            <Text style={styles.metricValue}>
              {complaints.filter(item => item.status === 'Pending').length}
            </Text>
          </View>
          <View style={styles.iconTileYellow}>
            <AppIcon name="clock" size={30} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.metricCard}>
          <View>
            <Text style={styles.metricLabel}>In Progress</Text>
            <Text style={styles.metricValue}>
              {complaints.filter(item => item.status === 'In Progress').length}
            </Text>
          </View>
          <View style={styles.iconTileBlue}>
            <AppIcon name="refresh" size={30} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.metricCard}>
          <View>
            <Text style={styles.metricLabel}>Resolved</Text>
            <Text style={styles.metricValue}>
              {complaints.filter(item => item.status === 'Resolved').length}
            </Text>
          </View>
          <View style={styles.iconTileGreen}>
            <AppIcon name="check" size={30} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.filterCard}>
          <Text style={styles.sectionTitle}>Filters</Text>
          <Text style={styles.filterLabel}>Search Complaints</Text>
          <TextInput
            accessibilityLabel="Search complaints"
            onChangeText={setSearchQuery}
            placeholder="Search title, ID, student..."
            placeholderTextColor="#777777"
            returnKeyType="search"
            style={styles.searchInput}
            value={searchQuery}
          />
          <Text style={styles.filterLabel}>Filter by Status</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => setOpenFilter('status')}
            style={styles.selectBox}>
            <Text style={styles.selectText}>{statusFilter}</Text>
            <AppIcon name="chevronDown" size={20} />
          </Pressable>

          <Text style={styles.filterLabel}>Filter by College</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => setOpenFilter('college')}
            style={styles.selectBox}>
            <Text style={styles.selectText}>{collegeFilter}</Text>
            <AppIcon name="chevronDown" size={20} />
          </Pressable>
        </View>

        <Text style={styles.complaintsTitle}>All Complaints</Text>
        <View style={styles.complaintsCard}>
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map(complaint => {
              const expanded = expandedComplaint === complaint.id;
              return (
                <View key={complaint.id} style={styles.complaintItem}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setExpandedComplaint(expanded ? null : complaint.id)}>
                  <View style={styles.complaintHeading}>
                    <Text style={styles.complaintTitle}>{complaint.title}</Text>
                    <View style={[styles.statusBadge, statusStyles[complaint.status]]}>
                      <Text style={styles.statusText}>{complaint.status}</Text>
                    </View>
                  </View>
                  <Text numberOfLines={expanded ? undefined : 2} style={styles.complaintDescription}>
                    {complaint.description}
                  </Text>
                  </Pressable>
                  {expanded ? (
                    <View style={styles.complaintDetails}>
                      <Text style={styles.detailText}>Complaint ID: {complaint.id}</Text>
                      <Text style={styles.detailText}>Student: {complaint.student}</Text>
                      <Text style={styles.detailText}>
                        {complaint.college} · {complaint.department}
                      </Text>
                      <Text style={styles.detailText}>
                        {complaint.category} · {complaint.priority} priority
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
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => setStatusComplaintId(complaint.id)}
                        style={styles.updateStatusButton}>
                        <Text style={styles.updateStatusLabel}>Update Status</Text>
                      </Pressable>
                    </View>
                  ) : null}
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyText}>No complaints match these filters.</Text>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={openFilter !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenFilter(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setOpenFilter(null)}>
          <View style={styles.optionsCard}>
            <Text style={styles.optionsTitle}>
              {openFilter === 'status' ? 'Select Status' : 'Select College'}
            </Text>
            {options.map(option => (
              <Pressable
                key={option}
                accessibilityRole="button"
                onPress={() => chooseFilter(option)}
                style={styles.optionRow}>
                <Text style={[styles.optionText, option === filterValue && styles.selectedOptionText]}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
      <Modal
        visible={adminMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAdminMenuVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setAdminMenuVisible(false)}>
          <View style={styles.optionsCard}>
            <Text style={styles.optionsTitle}>Admin Menu</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setAdminMenuVisible(false);
                onLogout();
              }}
              style={styles.optionRow}>
              <Text style={styles.optionText}>Log Out</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
      <Modal
        visible={statusComplaintId !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setStatusComplaintId(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setStatusComplaintId(null)}>
          <View style={styles.optionsCard}>
            <Text style={styles.optionsTitle}>Update Complaint Status</Text>
            {(['Pending', 'In Progress', 'Resolved'] as ComplaintStatus[]).map(status => (
              <Pressable
                key={status}
                accessibilityRole="button"
                onPress={() => {
                  if (statusComplaintId) {
                    onStatusChange(statusComplaintId, status);
                  }
                  setStatusComplaintId(null);
                }}
                style={styles.optionRow}>
                <Text style={styles.optionText}>{status}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const statusStyles = StyleSheet.create({
  Pending: {backgroundColor: '#FFF0C2'},
  'In Progress': {backgroundColor: '#DCEBFF'},
  Resolved: {backgroundColor: '#D8F4E2'},
  New: {backgroundColor: '#ECE7FA'},
});

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#F5F5F5'},
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
  menuButton: {
    width: 38,
    height: 38,
    marginLeft: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {flex: 1, backgroundColor: '#F5F5F5'},
  content: {paddingHorizontal: 20, paddingBottom: 32},
  pageTitle: {
    fontSize: 36,
    color: '#111111',
    marginTop: 18,
    marginBottom: 18,
    fontFamily,
  },
  metricCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 22,
    paddingVertical: 18,
    minHeight: 128,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  metricLabel: {
    fontSize: 20,
    color: '#323232',
    fontFamily,
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 34,
    color: '#111111',
    fontFamily,
    lineHeight: 40,
  },
  iconTileBlue: {
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: '#0E4C9E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTileYellow: {
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: '#E3B400',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTileGreen: {
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: '#22B573',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 22,
    marginTop: 18,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: 30,
    color: '#111111',
    fontFamily,
    marginBottom: 18,
  },
  filterLabel: {
    fontSize: 21,
    color: '#292929',
    fontFamily,
    marginBottom: 8,
    marginTop: 4,
  },
  selectBox: {
    minHeight: 54,
    borderRadius: 10,
    backgroundColor: '#EAEAEA',
    borderWidth: 1,
    borderColor: '#D4D4D4',
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectText: {fontSize: 21, color: '#111111', fontFamily},
  searchInput: {
    minHeight: 54,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#D4D4D4',
    paddingHorizontal: 14,
    color: '#111111',
    fontSize: 16,
    marginBottom: 16,
  },
  complaintsTitle: {
    fontSize: 36,
    color: '#111111',
    marginBottom: 16,
    fontFamily,
  },
  complaintsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 28,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  complaintItem: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  complaintHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 4,
  },
  complaintTitle: {
    flex: 1,
    fontSize: 21,
    color: '#111111',
    fontFamily,
  },
  statusBadge: {borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4},
  statusText: {fontSize: 12, color: '#333333', fontWeight: '600'},
  complaintDescription: {
    fontSize: 16,
    lineHeight: 22,
    color: '#404040',
    fontFamily,
  },
  complaintDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    marginTop: 12,
    paddingTop: 10,
    gap: 5,
  },
  detailText: {fontSize: 15, color: '#444444'},
  attachmentList: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8},
  attachmentPreview: {width: 64, height: 64, borderRadius: 8},
  updateStatusButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background,
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginTop: 8,
  },
  updateStatusLabel: {color: '#FFFFFF', fontSize: 15, fontWeight: '600'},
  emptyText: {paddingVertical: 24, fontSize: 17, color: '#555555', textAlign: 'center'},
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  optionsCard: {backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 12},
  optionsTitle: {
    color: '#111111',
    fontSize: 23,
    fontFamily,
    paddingVertical: 12,
  },
  optionRow: {paddingVertical: 13, borderTopWidth: 1, borderTopColor: '#E7E7E7'},
  optionText: {fontSize: 18, color: '#333333'},
  selectedOptionText: {color: '#0E4C9E', fontWeight: '700'},
});

export default AdminDashboardScreen;
