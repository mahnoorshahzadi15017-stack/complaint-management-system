import React, {useEffect, useState} from 'react';
import {Alert, StatusBar} from 'react-native';
import * as api from './src/lib/api';
import {ApiUser} from './src/lib/api';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import CreateComplaintScreen from './src/screens/CreateComplaintScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import LoginScreen from './src/screens/LoginScreen';
import MyComplaintsScreen from './src/screens/MyComplaintsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RoleSelectionScreen from './src/screens/RoleSelectionScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import SplashScreen from './src/screens/SplashScreen';
import StudentDashboardScreen from './src/screens/StudentDashboardScreen';
import {Complaint, ComplaintStatus, NewComplaint} from './src/types/complaint';
import {StudentDestination} from './src/components/StudentNavigationMenu';

type AppScreen =
  | 'splash'
  | 'roles'
  | 'studentLogin'
  | 'adminLogin'
  | 'studentSignUp'
  | 'studentForgotPassword'
  | 'adminForgotPassword'
  | 'studentDashboard'
  | 'studentProfile'
  | 'myComplaints'
  | 'createComplaint'
  | 'adminDashboard';

function getUserRole(user: ApiUser): 'Student' | 'Admin' {
  const role = user.app_metadata?.role;
  if (role !== 'Student' && role !== 'Admin') {
    throw new Error('This account does not have a valid application role.');
  }
  return role;
}

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<AppScreen>('splash');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [complaintsLoaded, setComplaintsLoaded] = useState(false);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [sessionRole, setSessionRole] = useState<'Student' | 'Admin' | null>(null);
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);
  const [studentComplaintFilter, setStudentComplaintFilter] = useState<ComplaintStatus | 'All'>('All');
  const [splashElapsed, setSplashElapsed] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setSplashElapsed(true), 2500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (screen === 'splash' && splashElapsed && complaintsLoaded && sessionLoaded) {
      setScreen(sessionRole === 'Admin' ? 'adminDashboard' : sessionRole === 'Student' ? 'studentDashboard' : 'roles');
    }
  }, [complaintsLoaded, screen, sessionLoaded, sessionRole, splashElapsed]);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        if (await api.hasSavedSession()) {
          const user = await api.getCurrentUser();
          const role = getUserRole(user);
          if (active) {
            setCurrentUser(user);
            setSessionRole(role);
          }
        }
      } catch (error) {
        Alert.alert(
          'Unable to restore session',
          error instanceof Error ? error.message : 'The saved login could not be restored.',
        );
      } finally {
        if (active) {
          setSessionLoaded(true);
        }
      }
    };

    void loadSession();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!sessionLoaded) {
      return;
    }
    let active = true;

    const loadComplaints = async () => {
      setComplaintsLoaded(false);
      try {
        const loadedComplaints = sessionRole ? await api.listComplaints() : [];
        if (active) {
          setComplaints(loadedComplaints);
        }
      } catch (error) {
        Alert.alert(
          'Unable to load complaints',
          error instanceof Error ? error.message : 'Complaint data could not be loaded.',
        );
      } finally {
        if (active) {
          setComplaintsLoaded(true);
        }
      }
    };

    void loadComplaints();
    return () => {
      active = false;
    };
  }, [sessionLoaded, sessionRole]);

  const handleRoleSelect = (selectedRole: 'Student' | 'Admin') => {
    setScreen(selectedRole === 'Admin' ? 'adminLogin' : 'studentLogin');
  };

  const handleLogin = async (role: 'Student' | 'Admin', email: string, password: string) => {
    try {
      const user = await api.login(email, password);
      const isAdmin = getUserRole(user) === 'Admin';
      if ((role === 'Admin') !== isAdmin) {
        await api.logout();
        Alert.alert(
          'Access denied',
          role === 'Admin'
            ? 'This account is not authorized as an administrator.'
            : 'Administrator accounts must use the Admin login.',
        );
        return;
      }

      setCurrentUser(user);
      setSessionRole(role);
      setScreen(role === 'Admin' ? 'adminDashboard' : 'studentDashboard');
    } catch (error) {
      Alert.alert(
        'Login failed',
        error instanceof Error ? error.message : 'Please check your connection and try again.',
      );
    }
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    try {
      await api.signUp(name, email, password);
    } catch (error) {
      Alert.alert(
        'Sign up failed',
        error instanceof Error ? error.message : 'Please check your connection and try again.',
      );
      return;
    }

    try {
      const user = await api.login(email, password);
      const role = getUserRole(user);
      if (role !== 'Student') {
        await api.logout();
        throw new Error('Student accounts must use the Student login.');
      }
      setCurrentUser(user);
      setSessionRole(role);
      setScreen('studentDashboard');
    } catch {
      setScreen('studentLogin');
      Alert.alert('Account created', 'Your account was created. Please log in to continue.');
    }
  };

  const handleRecoveryComplete = async (role: 'Student' | 'Admin') => {
    try {
      const user = await api.getCurrentUser();
      const isAdmin = getUserRole(user) === 'Admin';
      if ((role === 'Admin') !== isAdmin) {
        await api.logout();
        Alert.alert('Access denied', 'This account is not authorized for this login.');
        return;
      }

      setCurrentUser(user);
      setSessionRole(role);
      setScreen(role === 'Admin' ? 'adminDashboard' : 'studentDashboard');
    } catch (error) {
      Alert.alert(
        'Unable to complete password reset',
        error instanceof Error ? error.message : 'Please log in with your new password.',
      );
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      setCurrentUser(null);
      setSessionRole(null);
      setComplaints([]);
      setScreen('roles');
    } catch (error) {
      Alert.alert(
        'Unable to log out',
        error instanceof Error ? error.message : 'The saved login could not be cleared.',
      );
    }
  };

  const handleStudentNavigation = (destination: StudentDestination) => {
    switch (destination) {
      case 'dashboard':
        setScreen('studentDashboard');
        break;
      case 'profile':
        setScreen('studentProfile');
        break;
      case 'newComplaint':
        setScreen('createComplaint');
        break;
      case 'myComplaints':
        setStudentComplaintFilter('All');
        setScreen('myComplaints');
        break;
      case 'logout':
        void handleLogout();
        break;
    }
  };

  const handleComplaintSubmit = async (newComplaint: NewComplaint): Promise<string | null> => {
    const complaintId = await api.createComplaint(newComplaint);
    let attachmentError: string | null = null;
    for (const attachment of newComplaint.attachments) {
      try {
        await api.uploadComplaintAttachment(complaintId, attachment);
      } catch (error) {
        attachmentError =
          error instanceof Error ? error.message : 'One or more images could not be uploaded.';
      }
    }
    setComplaints(await api.listComplaints());
    setStudentComplaintFilter('All');
    setScreen('myComplaints');
    return attachmentError;
  };

  const handleComplaintStatusChange = async (complaintId: string, status: ComplaintStatus) => {
    try {
      await api.updateComplaintStatus(complaintId, status);
      setComplaints(await api.listComplaints());
    } catch (error) {
      Alert.alert(
        'Unable to update complaint',
        error instanceof Error ? error.message : 'Please try again.',
      );
    }
  };

  const studentComplaints = complaints.filter(
    complaint => complaint.student === (currentUser?.user_metadata.full_name ?? ''),
  );
  const displayedStudentComplaints =
    studentComplaintFilter === 'All'
      ? studentComplaints
      : studentComplaints.filter(complaint => complaint.status === studentComplaintFilter);

  const handleShowStudentComplaints = (status: ComplaintStatus | 'All') => {
    setStudentComplaintFilter(status);
    setScreen('myComplaints');
  };

  return (
    <>
      <StatusBar hidden />
      {screen === 'splash' ? (
        <SplashScreen />
      ) : screen === 'roles' ? (
        <RoleSelectionScreen onSelectRole={handleRoleSelect} />
      ) : screen === 'studentLogin' ? (
        <LoginScreen
          role="Student"
          onBack={() => setScreen('roles')}
          onForgotPassword={() => setScreen('studentForgotPassword')}
          onSignUp={() => setScreen('studentSignUp')}
          onSuccess={(email, password) => handleLogin('Student', email, password)}
        />
      ) : screen === 'adminLogin' ? (
        <LoginScreen
          role="Admin"
          onBack={() => setScreen('roles')}
          onForgotPassword={() => setScreen('adminForgotPassword')}
          onSuccess={(email, password) => handleLogin('Admin', email, password)}
        />
      ) : screen === 'studentForgotPassword' ? (
        <ForgotPasswordScreen
          role="Student"
          onBack={() => setScreen('studentLogin')}
          onSuccess={() => handleRecoveryComplete('Student')}
        />
      ) : screen === 'adminForgotPassword' ? (
        <ForgotPasswordScreen
          role="Admin"
          onBack={() => setScreen('adminLogin')}
          onSuccess={() => handleRecoveryComplete('Admin')}
        />
      ) : screen === 'studentSignUp' ? (
        <SignUpScreen onBack={() => setScreen('studentLogin')} onSuccess={handleSignUp} />
      ) : screen === 'adminDashboard' ? (
        <AdminDashboardScreen
          complaints={complaints}
          onStatusChange={handleComplaintStatusChange}
          onLogout={() => void handleLogout()}
        />
      ) : screen === 'studentDashboard' ? (
        <StudentDashboardScreen
          complaints={studentComplaints}
          onNavigate={handleStudentNavigation}
          onShowComplaints={handleShowStudentComplaints}
        />
      ) : screen === 'studentProfile' ? (
        <ProfileScreen
          onNavigate={handleStudentNavigation}
          onBack={() => setScreen('studentDashboard')}
          onLogout={() => void handleLogout()}
          onProfileSaved={setCurrentUser}
        />
      ) : screen === 'myComplaints' ? (
        <MyComplaintsScreen
          complaints={displayedStudentComplaints}
          statusFilter={studentComplaintFilter}
          onNavigate={handleStudentNavigation}
        />
      ) : (
        <CreateComplaintScreen
          onNavigate={handleStudentNavigation}
          onSubmit={handleComplaintSubmit}
        />
      )}
    </>
  );
}

export default App;
