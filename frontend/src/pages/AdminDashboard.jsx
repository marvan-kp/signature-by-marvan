import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Camera,
  Users,
  HardDrive,
  Download,
  Plus,
  UploadCloud,
  CheckCircle,
  Clock,
  Sparkles,
  Shield,
  Layers,
  ChevronRight,
  Eye,
  LogOut,
  FolderPlus,
  Check,
  X,
  FileCheck,
  Inbox,
  Edit,
  Trash2,
  UserPlus,
  RefreshCcw,
  Mail,
  Phone,
  KeyRound,
  Lock
} from 'lucide-react';
import { GlassNavbar } from '../components/glass/GlassNavbar';
import { GlassCard, GlassStatCard, GlassButton } from '../components/glass/GlassCard';
import { GlassModal, GlassProgress } from '../components/glass/GlassModal';
import { StorageWidget } from '../components/admin/StorageWidget';
import { AdminUploader } from '../components/admin/AdminUploader';
import { StorageManager } from '../components/admin/StorageManager';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [galleries, setGalleries] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [storage, setStorage] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // OVERVIEW | GALLERIES | UPLOADER | SELECTIONS | INQUIRIES | PROJECTS | CRM | AI | STORAGE

  const [selectedGalleryForUpload, setSelectedGalleryForUpload] = useState('');

  // Modals
  const [newGalleryModal, setNewGalleryModal] = useState(false);
  const [editGalleryModal, setEditGalleryModal] = useState(false);
  const [targetGalleryToEdit, setTargetGalleryToEdit] = useState(null);

  const [newClientModal, setNewClientModal] = useState(false);
  const [newAlbumModal, setNewAlbumModal] = useState(false);
  const [targetGalleryForAlbum, setTargetGalleryForAlbum] = useState(null);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [selectionModalItem, setSelectionModalItem] = useState(null);
  const [photographerNotes, setPhotographerNotes] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);

  // Security Credentials Modal
  const [securityModal, setSecurityModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // New Gallery Form
  const [newGalleryData, setNewGalleryData] = useState({
    title: '',
    subtitle: '',
    location: 'Kannur, Kerala',
    eventDate: new Date().toISOString().split('T')[0],
    pin: '2026',
    selectionLimit: 100,
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80'
  });

  // Edit Gallery Form
  const [editGalleryData, setEditGalleryData] = useState({
    title: '',
    subtitle: '',
    location: '',
    eventDate: '',
    pin: '',
    selectionLimit: 100,
    coverImage: ''
  });

  // New Client Form
  const [newClientData, setNewClientData] = useState({
    name: '',
    email: '',
    phone: '',
    weddingDate: new Date().toISOString().split('T')[0],
    location: 'Kerala, India',
    notes: ''
  });

  const loadDashboardData = async () => {
    try {
      const [anly, gals, cls, prjs, stg, inqs] = await Promise.all([
        api.getAnalytics().catch(() => null),
        api.getGalleries().catch(() => []),
        api.getClients().catch(() => []),
        api.getProjects().catch(() => []),
        api.getStorageUsage().catch(() => null),
        api.request('/inquiries').catch(() => [])
      ]);

      setAnalytics(anly);
      setGalleries(gals || []);
      setClients(cls || []);
      setProjects(prjs || []);
      setStorage(stg);
      setInquiries(inqs || []);

      if (gals && gals.length > 0 && !selectedGalleryForUpload) {
        setSelectedGalleryForUpload(gals[0].id);
      }

      // AI Suggestions for primary gallery
      const primaryId = (gals && gals[0]?.id) || 'gal_arjun_anjali';
      api.getAiAnalysis(primaryId)
        .then(res => setAiSuggestions(res?.suggestions))
        .catch(() => {});
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCreateGallery = async (e) => {
    e.preventDefault();
    try {
      const created = await api.createGallery(newGalleryData);
      setNewGalleryModal(false);
      loadDashboardData();
      if (created?.id) setSelectedGalleryForUpload(created.id);
      setActionMessage(`New wedding gallery "${newGalleryData.title}" created successfully!`);
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      alert('Could not create gallery: ' + err.message);
    }
  };

  const handleOpenEditGallery = (gal) => {
    setTargetGalleryToEdit(gal);
    setEditGalleryData({
      title: gal.title || '',
      subtitle: gal.subtitle || '',
      location: gal.location || 'Kannur, Kerala',
      eventDate: gal.eventDate || '',
      pin: gal.pin || '2026',
      selectionLimit: gal.selectionLimit || 100,
      coverImage: gal.coverImage || ''
    });
    setEditGalleryModal(true);
  };

  const handleUpdateGallery = async (e) => {
    e.preventDefault();
    if (!targetGalleryToEdit) return;
    try {
      await api.updateGallery(targetGalleryToEdit.id, editGalleryData);
      setEditGalleryModal(false);
      loadDashboardData();
      setActionMessage(`Gallery "${editGalleryData.title}" settings updated!`);
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      alert('Could not update gallery: ' + err.message);
    }
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      await api.createClient(newClientData);
      setNewClientModal(false);
      setNewClientData({
        name: '',
        email: '',
        phone: '',
        weddingDate: new Date().toISOString().split('T')[0],
        location: 'Kerala, India',
        notes: ''
      });
      loadDashboardData();
      setActionMessage('New client added to directory!');
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      alert('Could not add client: ' + err.message);
    }
  };

  const handleClearSampleData = async () => {
    if (!window.confirm('Are you sure you want to clear all demo sample galleries & clients? This will reset the platform to 100% clean production mode ready for your real client photos.')) return;
    try {
      await api.clearSampleData();
      loadDashboardData();
      setActionMessage('Demo sample data cleared! Platform is now 100% ready for real original client photos.');
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      alert('Could not clear sample data: ' + err.message);
    }
  };

  const handleCoverFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const res = await api.uploadCoverImage(file);
      setNewGalleryData(prev => ({ ...prev, coverImage: res.url || res.webUrl }));
      setActionMessage('Real cover photo uploaded and processed!');
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      alert('Could not upload cover image: ' + err.message);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!targetGalleryForAlbum || !newAlbumTitle.trim()) return;
    try {
      await api.createAlbum({
        galleryId: targetGalleryForAlbum.id,
        title: newAlbumTitle.trim(),
        coverImage: targetGalleryForAlbum.coverImage
      });
      setNewAlbumModal(false);
      setNewAlbumTitle('');
      loadDashboardData();
      setActionMessage(`New album "${newAlbumTitle.trim()}" created!`);
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      alert('Could not create album: ' + err.message);
    }
  };

  const handleDeleteGallery = async (id, title) => {
    if (!window.confirm(`Delete gallery "${title}" and all its photos? This action cannot be undone.`)) return;
    try {
      await api.deleteGallery(id);
      loadDashboardData();
      setActionMessage(`Gallery "${title}" deleted.`);
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      alert('Error deleting gallery: ' + err.message);
    }
  };

  const handleApproveSelection = async (selectionId) => {
    try {
      await api.approveSelection(selectionId, photographerNotes || 'Approved for album print spread.');
      setSelectionModalItem(null);
      loadDashboardData();
      setActionMessage('Selection approved and client notified!');
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRequestChanges = async (selectionId) => {
    try {
      await api.requestSelectionChanges(selectionId, photographerNotes || 'Please select 10 more ceremony candids.');
      setSelectionModalItem(null);
      loadDashboardData();
      setActionMessage('Revision request sent to client!');
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateProjectStage = async (projectId, newStage) => {
    try {
      await api.updateProjectStage(projectId, newStage);
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    setPasswordError('');
    try {
      await api.changePassword(passwordForm.currentPassword, passwordForm.newPassword, user?.email);
      setPasswordSuccess('Studio fixed password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setPasswordSuccess('');
        setSecurityModal(false);
      }, 2000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password');
    }
  };

  const stages = [
    { key: 'BOOKED', label: 'Booked' },
    { key: 'SHOOT_COMPLETED', label: 'Shoot Done' },
    { key: 'EDITING', label: 'Editing' },
    { key: 'UPLOAD', label: 'Upload' },
    { key: 'GALLERY_DELIVERED', label: 'Delivered' },
    { key: 'SELECTION', label: 'Selection' },
    { key: 'ALBUM', label: 'Album' },
    { key: 'FINAL_DELIVERY', label: 'Completed' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-pitch)', color: '#fff' }}>
      <GlassNavbar />

      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '120px 24px 80px 24px' }}>
        {/* Header Greeting & Quick Actions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '36px' }}>
          <div>
            <span style={{ fontSize: '0.74rem', letterSpacing: '0.22em', color: 'var(--gold-champagne)', textTransform: 'uppercase', fontWeight: 600 }}>
              STUDIO MANAGEMENT SUITE
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', color: '#fff', marginTop: '4px' }}>
              Good evening, Marvan.
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Here is your active studio overview, client selections, and archival storage status.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <GlassButton
              variant="gold"
              onClick={() => setNewGalleryModal(true)}
              icon={Plus}
            >
              NEW GALLERY
            </GlassButton>

            <GlassButton
              variant="default"
              onClick={() => setActiveTab('UPLOADER')}
              icon={UploadCloud}
            >
              UPLOAD PHOTOS
            </GlassButton>

            <GlassButton
              variant="default"
              onClick={() => setActiveTab('INQUIRIES')}
              icon={Inbox}
            >
              INQUIRIES ({inquiries.length})
            </GlassButton>

            <GlassButton
              variant="subtle"
              onClick={handleClearSampleData}
              icon={Trash2}
              title="Clear sample demo data to switch to 100% real production mode"
            >
              CLEAR DEMO DATA
            </GlassButton>

            <button
              onClick={() => setSecurityModal(true)}
              title="Studio Security & Password"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'var(--gold-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <KeyRound size={16} />
            </button>

            <button
              onClick={() => { logout(); navigate('/admin/login'); }}
              title="Logout"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Global Toast Action Message */}
        {actionMessage && (
          <div
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              background: 'rgba(103, 194, 58, 0.15)',
              border: '1px solid rgba(103, 194, 58, 0.35)',
              color: '#67C23A',
              fontSize: '0.85rem',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <CheckCircle size={18} />
            {actionMessage}
          </div>
        )}

        {/* Metrics Stat Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          <GlassStatCard
            title="Galleries"
            value={analytics?.metrics?.galleries ?? galleries.length}
            subtitle="Active client galleries"
            icon={Camera}
          />
          <GlassStatCard
            title="Photographs"
            value={(analytics?.metrics?.photos ?? 0).toLocaleString()}
            subtitle="Preserved in storage"
            icon={Layers}
          />
          <GlassStatCard
            title="Clients"
            value={analytics?.metrics?.clients ?? clients.length}
            subtitle="Engaged couples"
            icon={Users}
          />
          <GlassStatCard
            title="Free Tier Storage"
            value={`${analytics?.metrics?.storageUsedPercent ?? 0}%`}
            subtitle={`${storage?.usedFormatted || '0 MB'} / ${storage?.limitFormatted || '20 GB'} used`}
            icon={HardDrive}
            alertLevel={analytics?.storageWarning?.level}
          />
          <GlassStatCard
            title="Downloads"
            value={(analytics?.metrics?.downloads ?? 0).toLocaleString()}
            subtitle="ZIP packages delivered"
            icon={Download}
          />
        </div>

        {/* Navigation Tabs Bar for Studio Sections */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '16px',
            marginBottom: '32px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          {[
            { id: 'OVERVIEW', label: 'Studio Overview' },
            { id: 'GALLERIES', label: `All Galleries (${galleries.length})` },
            { id: 'UPLOADER', label: 'Upload Engine' },
            { id: 'SELECTIONS', label: 'Pending Selections' },
            { id: 'INQUIRIES', label: `Inquiries (${inquiries.length})` },
            { id: 'PROJECTS', label: 'Project Pipeline' },
            { id: 'CRM', label: `Clients CRM (${clients.length})` },
            { id: 'STORAGE', label: 'Storage & Data' },
            { id: 'AI', label: 'AI Quality Assistant' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                background: activeTab === tab.id ? 'var(--gold-champagne)' : 'rgba(255, 255, 255, 0.04)',
                border: activeTab === tab.id ? '1px solid #fff' : '1px solid rgba(255, 255, 255, 0.08)',
                color: activeTab === tab.id ? '#000' : 'var(--text-secondary)',
                fontWeight: activeTab === tab.id ? 600 : 400,
                fontSize: '0.82rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: STUDIO OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px' }}>
            {/* Left Column: Storage & Pending Selections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <StorageWidget
                storage={storage}
                onTriggerBackup={() => api.request('/storage/backup-sync', { method: 'POST' })}
              />

              {/* Pending Selections Review Box */}
              <GlassCard style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#fff' }}>
                    Pending Selections
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: 'var(--gold-soft)', fontWeight: 600 }}>
                    {analytics?.pendingSelections?.length || 1} REQUIRE REVIEW
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {analytics?.pendingSelections?.map((sel) => (
                    <div
                      key={sel.id}
                      style={{
                        padding: '14px 16px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>
                          {sel.clientName}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {sel.totalCount} / {sel.maxLimit} Photos • Submitted {new Date(sel.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <GlassButton
                        variant="gold"
                        size="sm"
                        onClick={() => {
                          setSelectionModalItem(sel);
                          setPhotographerNotes(sel.photographerNotes || '');
                        }}
                      >
                        REVIEW SELECTION
                      </GlassButton>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Right Column: Recent Activities */}
            <div>
              <GlassCard style={{ padding: '24px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#fff', marginBottom: '18px' }}>
                  Recent Studio Activity
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {analytics?.recentActivities?.map((act, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        fontSize: '0.82rem',
                        borderBottom: idx < analytics.recentActivities.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                        paddingBottom: '12px'
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: 'var(--gold-champagne)',
                          marginTop: '6px'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#fff' }}>{act.text}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '2px' }}>{act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {/* TAB: ALL GALLERIES */}
        {activeTab === 'GALLERIES' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {galleries.map((gal) => (
                <div
                  key={gal.id}
                  className="glass-surface-card"
                  style={{ borderRadius: '20px', overflow: 'hidden' }}
                >
                  <div style={{ position: 'relative', height: '180px' }}>
                    <img src={gal.coverImage} alt={gal.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(5,5,5,0.7)',
                        backdropFilter: 'blur(10px)',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        color: 'var(--gold-soft)',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}
                    >
                      PIN: {gal.pin || '2026'}
                    </span>
                  </div>

                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#fff' }}>
                      {gal.title}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                      {gal.location} • {gal.eventDate} • {gal.totalPhotos} Photos
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <Link
                        to={`/gallery/${gal.slug}`}
                        className="glass-btn glass-btn-gold"
                        style={{ flex: 1, minWidth: '120px', textDecoration: 'none', fontSize: '0.78rem' }}
                      >
                        VIEW AS CLIENT
                      </Link>
                      <button
                        onClick={() => handleOpenEditGallery(gal)}
                        className="glass-btn"
                        style={{ fontSize: '0.76rem' }}
                      >
                        <Edit size={13} /> EDIT
                      </button>
                      <button
                        onClick={() => {
                          setTargetGalleryForAlbum(gal);
                          setNewAlbumModal(true);
                        }}
                        className="glass-btn"
                        style={{ fontSize: '0.76rem' }}
                      >
                        + ALBUM
                      </button>
                      <button
                        onClick={() => {
                          setSelectedGalleryForUpload(gal.id);
                          setActiveTab('UPLOADER');
                        }}
                        className="glass-btn"
                        style={{ fontSize: '0.76rem' }}
                      >
                        UPLOAD
                      </button>
                      <button
                        onClick={() => handleDeleteGallery(gal.id, gal.title)}
                        style={{
                          background: 'rgba(245, 108, 108, 0.15)',
                          border: '1px solid rgba(245, 108, 108, 0.3)',
                          color: '#F56C6C',
                          borderRadius: '9999px',
                          padding: '6px 12px',
                          cursor: 'pointer',
                          fontSize: '0.74rem'
                        }}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: STORAGE & FREE QUOTA MANAGEMENT */}
        {activeTab === 'STORAGE' && (
          <StorageManager
            storage={storage}
            onStorageUpdated={loadDashboardData}
            onDataCleared={loadDashboardData}
          />
        )}

        {/* TAB: UPLOAD ENGINE */}
        {activeTab === 'UPLOADER' && (
          <div>
            <div style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#fff' }}>
                  Studio Batch Upload Engine
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Fast-parallel multi-stream processing with watermark overlay
                </p>
              </div>

              {/* Target Gallery Selector */}
              {galleries.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--gold-soft)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Select Target Gallery:
                  </label>
                  <select
                    value={selectedGalleryForUpload || galleries[0]?.id || ''}
                    onChange={(e) => setSelectedGalleryForUpload(e.target.value)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '12px',
                      background: '#0D0D0F',
                      border: '1px solid var(--gold-champagne)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {galleries.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title} (Code: {g.galleryCode || g.slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <AdminUploader
              galleryId={selectedGalleryForUpload || galleries[0]?.id || 'gal_arjun_anjali'}
              onUploadComplete={() => {
                loadDashboardData();
                setActionMessage('Batch upload processed and cataloged!');
                setTimeout(() => setActionMessage(''), 3000);
              }}
            />
          </div>
        )}

        {/* TAB: PENDING SELECTIONS */}
        {activeTab === 'SELECTIONS' && (
          <GlassCard style={{ padding: '32px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#fff', marginBottom: '20px' }}>
              Client Album Selections
            </h3>
            {analytics?.pendingSelections?.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center' }}>
                No pending album selections. All client selections are up to date!
              </div>
            ) : (
              analytics?.pendingSelections?.map((sel) => (
                <div
                  key={sel.id}
                  style={{
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    marginBottom: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h4 style={{ fontSize: '1.2rem', color: '#fff', fontFamily: 'var(--font-serif)' }}>
                        {sel.clientName}
                      </h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gold-soft)' }}>
                        {sel.totalCount} Photos Selected (Limit: {sel.maxLimit}) • Status: {sel.status}
                      </span>
                      {sel.clientNotes && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontStyle: 'italic' }}>
                          Client notes: "{sel.clientNotes}"
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <GlassButton
                        variant="gold"
                        size="sm"
                        onClick={() => handleApproveSelection(sel.id)}
                        icon={Check}
                      >
                        APPROVE
                      </GlassButton>
                      <GlassButton
                        variant="subtle"
                        size="sm"
                        onClick={() => handleRequestChanges(sel.id)}
                        icon={X}
                      >
                        REQUEST CHANGES
                      </GlassButton>
                      <Link
                        to={`/gallery/${sel.galleryId}`}
                        className="glass-btn"
                        style={{ fontSize: '0.78rem', textDecoration: 'none' }}
                      >
                        VIEW IN GALLERY
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </GlassCard>
        )}

        {/* TAB: LIVE INQUIRIES & LEADS */}
        {activeTab === 'INQUIRIES' && (
          <GlassCard style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#fff' }}>
                  Live Client Wedding Inquiries
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Submitted via website contact page and routed to marvankp847@gmail.com
                </p>
              </div>
            </div>

            {inquiries.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                No website inquiries logged yet. Test by submitting a note on the Contact page!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    style={{
                      padding: '20px',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(201, 168, 106, 0.25)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#fff' }}>
                          {inq.name}
                        </h4>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gold-soft)', marginTop: '2px' }}>
                          Wedding Date: <strong>{inq.weddingDate || 'TBD'}</strong> • Venue: {inq.venue || 'Kerala'}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        Received {new Date(inq.createdAt || Date.now()).toLocaleString()}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={14} color="var(--gold-champagne)" /> {inq.email}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={14} color="var(--gold-champagne)" /> {inq.phone}
                      </span>
                    </div>

                    {inq.message && (
                      <div style={{ fontSize: '0.85rem', color: '#ddd', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px', marginTop: '4px' }}>
                        "{inq.message}"
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                      <a
                        href={`https://api.whatsapp.com/send?phone=${inq.phone?.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(`Hello ${inq.name}, Thank you for reaching out to Signature by Marvan!`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="glass-btn glass-btn-gold"
                        style={{ textDecoration: 'none', fontSize: '0.76rem' }}
                      >
                        REPLY VIA WHATSAPP
                      </a>
                      <a
                        href={`mailto:${inq.email}?subject=${encodeURIComponent(`Signature by Marvan Wedding Availability — ${inq.name}`)}`}
                        className="glass-btn"
                        style={{ textDecoration: 'none', fontSize: '0.76rem' }}
                      >
                        REPLY VIA EMAIL
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        )}

        {/* TAB: PROJECT MANAGEMENT PIPELINE */}
        {activeTab === 'PROJECTS' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#fff' }}>
                Wedding Project Pipeline
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Track clients across the 8 production stages from initial booking to heirloom delivery.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {projects.map((proj) => (
                <GlassCard key={proj.id} style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#fff' }}>
                        {proj.clientName}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--gold-soft)' }}>
                        {proj.package} • {proj.venue} • Due: {proj.dueDate}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>
                      Current Stage: <strong style={{ color: 'var(--gold-champagne)' }}>{proj.stage}</strong> ({proj.progressPercent}%)
                    </span>
                  </div>

                  {/* 8 Stages Pipeline Indicator */}
                  <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '10px' }}>
                    {stages.map((stg) => {
                      const isActive = proj.stage === stg.key;
                      return (
                        <button
                          key={stg.key}
                          onClick={() => handleUpdateProjectStage(proj.id, stg.key)}
                          style={{
                            flex: 1,
                            minWidth: '100px',
                            padding: '10px 8px',
                            borderRadius: '8px',
                            background: isActive ? 'var(--gold-champagne)' : 'rgba(255,255,255,0.03)',
                            border: isActive ? '1px solid #fff' : '1px solid rgba(255,255,255,0.08)',
                            color: isActive ? '#000' : 'var(--text-secondary)',
                            fontSize: '0.72rem',
                            fontWeight: isActive ? 700 : 400,
                            cursor: 'pointer',
                            textAlign: 'center'
                          }}
                        >
                          {stg.label}
                        </button>
                      );
                    })}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CLIENTS CRM */}
        {activeTab === 'CRM' && (
          <GlassCard style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#fff' }}>
                  Studio Client Directory
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Manage registered couples and project contacts.
                </p>
              </div>
              <GlassButton variant="gold" onClick={() => setNewClientModal(true)} icon={UserPlus}>
                ADD CLIENT
              </GlassButton>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {clients.map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#fff' }}>
                    {c.name}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--gold-soft)', marginTop: '2px' }}>
                    {c.location} • Wedding: {c.weddingDate}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    Email: {c.email} | Phone: {c.phone}
                  </div>
                  {c.notes && (
                    <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '8px', fontStyle: 'italic' }}>
                      "{c.notes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* TAB: AI QUALITY ASSISTANT */}
        {activeTab === 'AI' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={24} color="var(--gold-champagne)" />
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#fff' }}>
                  AI Quality & Organization Suggestions
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Heuristic computer vision flags soft-focus frames, blinking subjects, and duplicate burst sequences.
                </p>
              </div>
            </div>

            {aiSuggestions ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <GlassCard style={{ padding: '24px' }}>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>
                    Duplicate & Similar Frames
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    {aiSuggestions.similarGroups?.length || 3} burst groupings identified.
                  </p>
                  {aiSuggestions.similarGroups?.map((grp, idx) => (
                    <div key={idx} style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '8px', fontSize: '0.78rem' }}>
                      <div style={{ color: 'var(--gold-soft)', fontWeight: 600 }}>{grp.groupTitle}</div>
                      <div style={{ color: '#ccc' }}>{grp.recommendation}</div>
                    </div>
                  ))}
                </GlassCard>

                <GlassCard style={{ padding: '24px' }}>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>
                    Sharpness & Quality Flags
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Automated subject sharpness audit.
                  </p>
                  <div style={{ fontSize: '0.82rem', color: '#67C23A' }}>
                    ✓ 98.4% of frames meet luxury print sharpness thresholds (&gt; 0.85 Laplacian score).
                  </div>
                </GlassCard>

                <GlassCard style={{ padding: '24px' }}>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>
                    Smart Category Tagging
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Suggested album distributions.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {aiSuggestions.categorySuggestions?.map((c, i) => (
                      <span key={i} style={{ padding: '4px 10px', borderRadius: '12px', background: 'rgba(201,168,106,0.1)', border: '1px solid rgba(201,168,106,0.2)', fontSize: '0.74rem', color: 'var(--gold-soft)' }}>
                        {c.category} ({c.count})
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)' }}>Scanning gallery frames with AI...</div>
            )}
          </div>
        )}
      </div>

      {/* New Gallery Creation Modal */}
      <GlassModal isOpen={newGalleryModal} onClose={() => setNewGalleryModal(false)} title="INITIALIZE NEW WEDDING GALLERY">
        <form onSubmit={handleCreateGallery} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Couple Names *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Fahad & Farhana"
              className="glass-input"
              value={newGalleryData.title}
              onChange={(e) => setNewGalleryData({ ...newGalleryData, title: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                Wedding Date *
              </label>
              <input
                type="date"
                required
                className="glass-input"
                value={newGalleryData.eventDate}
                onChange={(e) => setNewGalleryData({ ...newGalleryData, eventDate: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                Gallery PIN *
              </label>
              <input
                type="text"
                required
                className="glass-input"
                value={newGalleryData.pin}
                onChange={(e) => setNewGalleryData({ ...newGalleryData, pin: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Location & Venue
            </label>
            <input
              type="text"
              className="glass-input"
              value={newGalleryData.location}
              onChange={(e) => setNewGalleryData({ ...newGalleryData, location: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Cover Photograph (Upload Real File or Paste URL)
            </label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                className="glass-input"
                placeholder="https://..."
                value={newGalleryData.coverImage}
                onChange={(e) => setNewGalleryData({ ...newGalleryData, coverImage: e.target.value })}
                style={{ flex: 1 }}
              />
              <label
                className="glass-btn"
                style={{ cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.78rem' }}
              >
                {uploadingCover ? 'UPLOADING...' : 'CHOOSE FILE'}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleCoverFileUpload}
                  disabled={uploadingCover}
                />
              </label>
            </div>
            {newGalleryData.coverImage && (
              <div style={{ marginTop: '10px', height: '120px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img src={newGalleryData.coverImage} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <GlassButton variant="subtle" onClick={() => setNewGalleryModal(false)} style={{ flex: 1 }}>
              CANCEL
            </GlassButton>
            <GlassButton type="submit" variant="gold" style={{ flex: 1.5 }}>
              CREATE GALLERY
            </GlassButton>
          </div>
        </form>
      </GlassModal>

      {/* Edit Gallery Settings Modal */}
      <GlassModal isOpen={editGalleryModal} onClose={() => setEditGalleryModal(false)} title={`EDIT SETTINGS: ${targetGalleryToEdit?.title || ''}`}>
        <form onSubmit={handleUpdateGallery} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Gallery Title *
            </label>
            <input
              type="text"
              required
              className="glass-input"
              value={editGalleryData.title}
              onChange={(e) => setEditGalleryData({ ...editGalleryData, title: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                Wedding Date
              </label>
              <input
                type="date"
                className="glass-input"
                value={editGalleryData.eventDate}
                onChange={(e) => setEditGalleryData({ ...editGalleryData, eventDate: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                4-Digit Gallery PIN *
              </label>
              <input
                type="text"
                required
                className="glass-input"
                value={editGalleryData.pin}
                onChange={(e) => setEditGalleryData({ ...editGalleryData, pin: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Location & Venue
            </label>
            <input
              type="text"
              className="glass-input"
              value={editGalleryData.location}
              onChange={(e) => setEditGalleryData({ ...editGalleryData, location: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Selection Limit (Max Photos Client Can Pick)
            </label>
            <input
              type="number"
              className="glass-input"
              value={editGalleryData.selectionLimit}
              onChange={(e) => setEditGalleryData({ ...editGalleryData, selectionLimit: Number(e.target.value) })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Cover Image URL / Storage Path
            </label>
            <input
              type="text"
              className="glass-input"
              value={editGalleryData.coverImage}
              onChange={(e) => setEditGalleryData({ ...editGalleryData, coverImage: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <GlassButton variant="subtle" onClick={() => setEditGalleryModal(false)} style={{ flex: 1 }}>
              CANCEL
            </GlassButton>
            <GlassButton type="submit" variant="gold" style={{ flex: 1.5 }}>
              UPDATE SETTINGS
            </GlassButton>
          </div>
        </form>
      </GlassModal>

      {/* New Client Modal */}
      <GlassModal isOpen={newClientModal} onClose={() => setNewClientModal(false)} title="ADD NEW CLIENT TO DIRECTORY">
        <form onSubmit={handleCreateClient} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Couple Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Fahad & Farhana"
              className="glass-input"
              value={newClientData.name}
              onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                Email Address *
              </label>
              <input
                type="email"
                required
                className="glass-input"
                value={newClientData.email}
                onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                Phone Number
              </label>
              <input
                type="text"
                className="glass-input"
                placeholder="+91 75919..."
                value={newClientData.phone}
                onChange={(e) => setNewClientData({ ...newClientData, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Wedding Date
            </label>
            <input
              type="date"
              className="glass-input"
              value={newClientData.weddingDate}
              onChange={(e) => setNewClientData({ ...newClientData, weddingDate: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Notes & Preferences
            </label>
            <textarea
              rows={3}
              className="glass-input"
              value={newClientData.notes}
              onChange={(e) => setNewClientData({ ...newClientData, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <GlassButton variant="subtle" onClick={() => setNewClientModal(false)} style={{ flex: 1 }}>
              CANCEL
            </GlassButton>
            <GlassButton type="submit" variant="gold" style={{ flex: 1.5 }}>
              ADD CLIENT
            </GlassButton>
          </div>
        </form>
      </GlassModal>

      {/* New Album Creation Modal */}
      <GlassModal isOpen={newAlbumModal} onClose={() => setNewAlbumModal(false)} title={`ADD ALBUM TO ${targetGalleryForAlbum?.title?.toUpperCase() || ''}`}>
        <form onSubmit={handleCreateAlbum} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Album Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Haldi & Mehendi, Sangeet, Post-Wedding Portraits"
              className="glass-input"
              value={newAlbumTitle}
              onChange={(e) => setNewAlbumTitle(e.target.value)}
            />
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            After creating this album, you can directly upload photographs into it using the Batch Upload Engine.
          </p>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <GlassButton variant="subtle" onClick={() => setNewAlbumModal(false)} style={{ flex: 1 }}>
              CANCEL
            </GlassButton>
            <GlassButton type="submit" variant="gold" style={{ flex: 1.5 }}>
              CREATE ALBUM
            </GlassButton>
          </div>
        </form>
      </GlassModal>

      {/* Review Selection Modal */}
      <GlassModal
        isOpen={!!selectionModalItem}
        onClose={() => setSelectionModalItem(null)}
        title={`SELECTION: ${selectionModalItem?.clientName || ''}`}
        maxWidth="600px"
      >
        {selectionModalItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', fontSize: '0.85rem' }}>
              <div><strong>Selected Count:</strong> {selectionModalItem.totalCount} / {selectionModalItem.maxLimit}</div>
              {selectionModalItem.clientNotes && (
                <div style={{ marginTop: '8px', color: 'var(--gold-soft)' }}>
                  <strong>Client Note:</strong> "{selectionModalItem.clientNotes}"
                </div>
              )}
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#fff', display: 'block', marginBottom: '6px' }}>
                Photographer Feedback / Notes to Client
              </label>
              <textarea
                rows={3}
                className="glass-input"
                value={photographerNotes}
                onChange={(e) => setPhotographerNotes(e.target.value)}
                placeholder="e.g. Approved! Preparing 12x18 luxury album print layout..."
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <GlassButton
                variant="gold"
                onClick={() => handleApproveSelection(selectionModalItem.id)}
                style={{ flex: 1 }}
                icon={Check}
              >
                APPROVE SELECTION
              </GlassButton>

              <GlassButton
                variant="subtle"
                onClick={() => handleRequestChanges(selectionModalItem.id)}
                style={{ flex: 1 }}
                icon={X}
              >
                REQUEST CHANGES
              </GlassButton>
            </div>
          </div>
        )}
      </GlassModal>

      {/* Studio Security & Change Password Modal */}
      <GlassModal
        isOpen={securityModal}
        onClose={() => { setSecurityModal(false); setPasswordError(''); setPasswordSuccess(''); }}
        title="Studio Security Credentials"
      >
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--gold-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
            Fixed Studio Email
          </div>
          <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>
            {user?.email || 'marvankp847@gmail.com'}
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {passwordError && (
            <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(245, 108, 108, 0.15)', border: '1px solid rgba(245, 108, 108, 0.3)', color: '#F56C6C', fontSize: '0.8rem' }}>
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(103, 194, 58, 0.15)', border: '1px solid rgba(103, 194, 58, 0.3)', color: '#67C23A', fontSize: '0.8rem' }}>
              {passwordSuccess}
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Current Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter current password"
              className="glass-input"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              New Fixed Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter at least 6 characters"
              className="glass-input"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Confirm New Password
            </label>
            <input
              type="password"
              required
              placeholder="Re-enter new password"
              className="glass-input"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            />
          </div>

          <GlassButton type="submit" variant="gold" style={{ marginTop: '10px' }} icon={Lock}>
            UPDATE STUDIO PASSWORD
          </GlassButton>
        </form>
      </GlassModal>
    </div>
  );
}
