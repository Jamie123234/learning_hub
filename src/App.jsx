import { useState, useCallback } from 'react';
import { useApp } from './context/AppContext';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MetricsBanner from './components/MetricsBanner';
import CourseGrid from './components/CourseGrid';
import VideoModal from './components/VideoModal';
import AuthModal from './components/AuthModal';
import AccountPanel from './components/AccountPanel';
import AddCourseModal from './components/AddCourseModal';
import OfflineBanner from './components/OfflineBanner';
import './App.css';

export default function App() {
  const { currentUser } = useApp();

  // Modal states
  const [videoModal, setVideoModal] = useState({ open: false, id: '', title: '' });
  const [authOpen, setAuthOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [addCourseOpen, setAddCourseOpen] = useState(false);

  const openVideo = useCallback((id, title) => setVideoModal({ open: true, id, title }), []);
  const closeVideo = useCallback(() => { setVideoModal(v => ({ ...v, open: false })); }, []);

  return (
    <>
      <AnimatedBackground />
      <Navbar
        onOpenAuth={() => setAuthOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
        onOpenAddCourse={() => setAddCourseOpen(true)}
      />

      <main className="app-main">
        <Sidebar />
        <div className="content-col">
          <MetricsBanner />
          <CourseGrid
            onWatch={openVideo}
            onOpenAuth={() => setAuthOpen(true)}
          />
        </div>
      </main>

      {/* Modals */}
      <VideoModal
        isOpen={videoModal.open}
        videoId={videoModal.id}
        title={videoModal.title}
        onClose={closeVideo}
        onOpenAuth={() => setAuthOpen(true)}
      />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <AccountPanel isOpen={accountOpen} onClose={() => setAccountOpen(false)} />
      <AddCourseModal isOpen={addCourseOpen} onClose={() => setAddCourseOpen(false)} />
      <OfflineBanner />
    </>
  );
}
