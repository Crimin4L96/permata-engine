import React, { useState } from 'react';
import { ActiveEngine, Role, ToastMessage } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { WhatsAppEngineView, WhatsAppSubScreen } from './components/WhatsAppEngineView';
import { NotificationEngineView, NotificationSubScreen } from './components/NotificationEngineView';
import { HomeReportingView, HomeSubScreen } from './components/HomeReportingView';
import { SmsEngineView, SmsSubScreen } from './components/SmsEngineView';
import { ExportModal } from './components/modals/ExportModal';
import { DiffModal } from './components/modals/DiffModal';
import { MakerCheckerModal } from './components/modals/MakerCheckerModal';
import { AuditModal } from './components/modals/AuditModal';
import { MatrixModal } from './components/modals/MatrixModal';
import { Toast } from './components/Toast';

export default function App() {
  const [activeEngine, setActiveEngine] = useState<ActiveEngine>('whatsapp');
  const [currentRole, setCurrentRole] = useState<Role>('Admin');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sub-screen states for each engine
  const [waSubScreen, setWaSubScreen] = useState<WhatsAppSubScreen>('studio');
  const [notifSubScreen, setNotifSubScreen] = useState<NotificationSubScreen>('config');
  const [smsSubScreen, setSmsSubScreen] = useState<SmsSubScreen>('composer');
  const [homeSubScreen, setHomeSubScreen] = useState<HomeSubScreen>('executive');

  // Modals state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);
  const [reviewTaskTitle, setReviewTaskTitle] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#0D1E32] flex flex-col font-sans">
      {/* Top Global Header with 4 main menus prominently visible */}
      <Header
        activeEngine={activeEngine}
        setActiveEngine={(eng) => {
          setActiveEngine(eng);
          setIsMobileSidebarOpen(false);
        }}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        toggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        showToast={showToast}
      />

      {/* Dynamic Module Sidebar */}
      <Sidebar
        activeEngine={activeEngine}
        setActiveEngine={setActiveEngine}
        currentRole={currentRole}
        isMobileOpen={isMobileSidebarOpen}
        closeMobileSidebar={() => setIsMobileSidebarOpen(false)}
        waSubScreen={waSubScreen}
        setWaSubScreen={setWaSubScreen}
        notifSubScreen={notifSubScreen}
        setNotifSubScreen={setNotifSubScreen}
        smsSubScreen={smsSubScreen}
        setSmsSubScreen={setSmsSubScreen}
        homeSubScreen={homeSubScreen}
        setHomeSubScreen={setHomeSubScreen}
        onOpenMatrixModal={() => setIsMatrixModalOpen(true)}
        showToast={showToast}
      />

      {/* Main Content Area: accommodates 64px header on desktop, 108px on mobile */}
      <div className="lg:pl-64 flex-1">
        <main className="w-full pt-[108px] md:pt-16 min-h-[calc(100vh-4rem)] bg-[#F4F8FC]">
          {activeEngine === 'whatsapp' && (
            <WhatsAppEngineView
              currentRole={currentRole}
              showToast={showToast}
              onOpenDiffModal={() => setIsDiffModalOpen(true)}
              activeSubScreen={waSubScreen}
              setActiveSubScreen={setWaSubScreen}
            />
          )}

          {activeEngine === 'notification' && (
            <NotificationEngineView
              currentRole={currentRole}
              showToast={showToast}
              onOpenAuditModal={() => setIsAuditModalOpen(true)}
              activeSubScreen={notifSubScreen}
              setActiveSubScreen={setNotifSubScreen}
            />
          )}

          {activeEngine === 'home' && (
            <HomeReportingView
              currentRole={currentRole}
              setActiveEngine={setActiveEngine}
              showToast={showToast}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onOpenMakerCheckerReview={(title) => setReviewTaskTitle(title)}
              activeSubScreen={homeSubScreen}
              setActiveSubScreen={setHomeSubScreen}
            />
          )}

          {activeEngine === 'sms' && (
            <SmsEngineView
              currentRole={currentRole}
              showToast={showToast}
              activeSubScreen={smsSubScreen}
              setActiveSubScreen={setSmsSubScreen}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        showToast={showToast}
      />

      <DiffModal
        isOpen={isDiffModalOpen}
        onClose={() => setIsDiffModalOpen(false)}
        showToast={showToast}
      />

      <MakerCheckerModal
        taskTitle={reviewTaskTitle}
        onClose={() => setReviewTaskTitle(null)}
        showToast={showToast}
      />

      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

      <MatrixModal
        isOpen={isMatrixModalOpen}
        onClose={() => setIsMatrixModalOpen(false)}
      />

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
