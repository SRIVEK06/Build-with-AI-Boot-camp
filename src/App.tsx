import React, { useState, useEffect } from 'react';
import {
  UserRole,
  ActiveTab,
  StudentProfile,
  FacultyProfile,
  SubjectItem,
  Opportunity,
  AcademicResource,
  AppNotification,
  AppSettings,
} from './types';
import {
  initialStudent,
  initialFaculty,
  initialSubjects,
  radarCompetencyData,
  progressionData,
  initialOpportunities,
  initialResources,
  initialNotifications,
} from './data/mockData';
import { Header } from './components/Header';
import { StudentProfileBanner } from './components/StudentProfileBanner';
import { NavigationTabs } from './components/NavigationTabs';
import { AnalyticsView } from './components/AnalyticsView';
import { AttendanceBunkLab } from './components/AttendanceBunkLab';
import { OpportunitiesView } from './components/OpportunitiesView';
import { ResourcesView } from './components/ResourcesView';
import { SettingsView } from './components/SettingsView';
import { BottomNavBar } from './components/BottomNavBar';
import { LoginModal } from './components/LoginModal';

export default function App() {
  const [role, setRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<ActiveTab>('analytics');
  const [student, setStudent] = useState<StudentProfile>(initialStudent);
  const [faculty, setFaculty] = useState<FacultyProfile>(initialFaculty);
  const [subjects, setSubjects] = useState<SubjectItem[]>(initialSubjects);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [resources, setResources] = useState<AcademicResource[]>(initialResources);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  const [settings, setSettings] = useState<AppSettings>(() => {
    return {
      darkMode: true,
      highContrast: false,
      reduceMotion: false,
      fontSize: 'base',
      notificationsEnabled: true,
      attendanceThreshold: 75,
      hapticFeedback: true,
    };
  });

  // Apply dark/light class to HTML root element
  useEffect(() => {
    const root = document.documentElement;
    if (settings.darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [settings.darkMode, settings.highContrast]);

  // Recalculate student overall metrics whenever subjects are updated
  const handleUpdateSubjectAttendance = (
    subjectId: string,
    attendedDelta: number,
    conductedDelta: number
  ) => {
    setSubjects((prev) => {
      const updated = prev.map((s) => {
        if (s.id === subjectId) {
          return {
            ...s,
            attended: s.attended + attendedDelta,
            conducted: s.conducted + conductedDelta,
          };
        }
        return s;
      });

      const totalAttended = updated.reduce((acc, curr) => acc + curr.attended, 0);
      const totalConducted = updated.reduce((acc, curr) => acc + curr.conducted, 0);
      const overallPct = (totalAttended / totalConducted) * 100;
      const safeZonePct = overallPct - settings.attendanceThreshold;
      const bunkBuffer = Math.max(
        0,
        Math.floor((totalAttended - (settings.attendanceThreshold / 100) * totalConducted) / (settings.attendanceThreshold / 100))
      );

      setStudent((currStudent) => ({
        ...currStudent,
        attendancePct: parseFloat(overallPct.toFixed(1)),
        attendanceSafeZonePct: parseFloat(safeZonePct.toFixed(1)),
        bunkBufferHours: bunkBuffer,
      }));

      return updated;
    });
  };

  const handleToggleOpportunitySave = (id: string) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, saved: !o.saved } : o))
    );
  };

  const handleToggleResourceComplete = (id: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const handleUpvoteResource = (id: string) => {
    setResources((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const alreadyUpvoted = r.userUpvoted;
          return {
            ...r,
            upvotes: alreadyUpvoted ? r.upvotes - 1 : r.upvotes + 1,
            userUpvoted: !alreadyUpvoted,
          };
        }
        return r;
      })
    );
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleLoginSuccess = (newRole: UserRole, identifier: string) => {
    setRole(newRole);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsLoginModalOpen(true);
  };

  const handleResetDefaults = () => {
    setSettings({
      darkMode: true,
      highContrast: false,
      reduceMotion: false,
      fontSize: 'base',
      notificationsEnabled: true,
      attendanceThreshold: 75,
      hapticFeedback: true,
    });
    setSubjects(initialSubjects);
    setStudent(initialStudent);
  };

  const fontSizeClass =
    settings.fontSize === 'sm' ? 'text-xs' : settings.fontSize === 'lg' ? 'text-base' : 'text-sm';

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        settings.darkMode
          ? 'bg-slate-950 text-slate-100'
          : 'bg-slate-50 text-slate-800'
      } ${fontSizeClass} pb-24`}
    >
      {/* Background ambient glow effect */}
      {!settings.reduceMotion && (
        <>
          <div
            className={`fixed top-0 left-1/2 -translate-x-1/2 w-[340px] h-[340px] rounded-full blur-[110px] pointer-events-none transition-opacity duration-300 ${
              settings.darkMode ? 'bg-indigo-600/15' : 'bg-indigo-400/20'
            }`}
          />
          <div
            className={`fixed top-96 right-0 w-[240px] h-[240px] rounded-full blur-[90px] pointer-events-none transition-opacity duration-300 ${
              settings.darkMode ? 'bg-purple-600/15' : 'bg-purple-300/20'
            }`}
          />
        </>
      )}

      {/* Top Application Header */}
      <Header
        role={role}
        onRoleChange={setRole}
        darkMode={settings.darkMode}
        onToggleDarkMode={() =>
          setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }))
        }
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        userName={role === 'student' ? student.name : faculty.name}
      />

      {/* Main Content Area - Mobile Centered Shell (Responsive to Tablet/Desktop) */}
      <main className="max-w-xl mx-auto px-4 pt-3 pb-6 relative z-10">
        {/* Module A: Student / Faculty Profile Banner & Quick Metrics */}
        <StudentProfileBanner
          role={role}
          student={student}
          faculty={faculty}
          darkMode={settings.darkMode}
        />

        {/* Horizontal Navigation Tabs */}
        <NavigationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          darkMode={settings.darkMode}
        />

        {/* Tab Content Panes */}
        {activeTab === 'analytics' && (
          <AnalyticsView
            subjects={subjects}
            radarData={radarCompetencyData}
            progressionData={progressionData}
            currentCgpa={student.cgpa}
            initialTargetCgpa={student.targetCgpa}
            darkMode={settings.darkMode}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceBunkLab
            subjects={subjects}
            onUpdateSubjectAttendance={handleUpdateSubjectAttendance}
            darkMode={settings.darkMode}
          />
        )}

        {activeTab === 'opportunities' && (
          <OpportunitiesView
            opportunities={opportunities}
            onToggleSave={handleToggleOpportunitySave}
            darkMode={settings.darkMode}
          />
        )}

        {activeTab === 'resources' && (
          <ResourcesView
            resources={resources}
            onToggleComplete={handleToggleResourceComplete}
            onUpvote={handleUpvoteResource}
            darkMode={settings.darkMode}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={(newSettings) =>
              setSettings((prev) => ({ ...prev, ...newSettings }))
            }
            role={role}
            onRoleChange={setRole}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            onResetDefaults={handleResetDefaults}
            darkMode={settings.darkMode}
          />
        )}
      </main>

      {/* Bottom Navigation Bar for Mobile Shell Experience */}
      <BottomNavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        darkMode={settings.darkMode}
      />

      {/* Login & Authentication Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        darkMode={settings.darkMode}
      />
    </div>
  );
}
