import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, userAPI, contentAPI } from '../services/api';
import { Temple, Weapon, Fossil, HighScore, Feedback, User } from '../types';
import './AdminDashboard.css';

// Helper function to convert plain text to JSON format
const convertToJSON = (text: string): string => {
  // If it's already valid JSON, return as is
  try {
    JSON.parse(text);
    return text;
  } catch {
    // Convert plain text to JSON object with description field
    return JSON.stringify({ description: text.trim() });
  }
};

// Helper function to display JSON as plain text for editing
const convertFromJSON = (jsonString: string): string => {
  try {
    const parsed = JSON.parse(jsonString);
    // If it's an object with description field, return just the description
    if (typeof parsed === 'object' && parsed.description) {
      return parsed.description;
    }
    // If it's a plain string, return it
    if (typeof parsed === 'string') {
      return parsed;
    }
    // Otherwise return the JSON string
    return jsonString;
  } catch {
    // If parsing fails, return the original string
    return jsonString;
  }
};

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'temples' | 'weapons' | 'fossils' | 'analytics' | 'leaderboard' | 'feedback'>('temples');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Temples state
  const [temples, setTemples] = useState<Temple[]>([]);
  const [showAddTempleForm, setShowAddTempleForm] = useState(false);
  const [editingTemple, setEditingTemple] = useState<Temple | null>(null);
  const [templeForm, setTempleForm] = useState({
    name: '',
    dynasty: '',
    builder: '',
    time_period: '',
    historical_significance: '',
    weapon_used: '',
    static_image_url: '',
    model_3d_embed: '',
    audio_story_url: '',
  });

  // Weapons state
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [showAddWeaponForm, setShowAddWeaponForm] = useState(false);
  const [editingWeapon, setEditingWeapon] = useState<Weapon | null>(null);
  const [weaponForm, setWeaponForm] = useState({
    name: '',
    dynasty_context: [] as string[],
    type: '',
    description: '',
    image_url: '',
    model_3d_embed: '',
    audio_story_url: '',
  });

  // Fossils state
  const [fossils, setFossils] = useState<Fossil[]>([]);
  const [showAddFossilForm, setShowAddFossilForm] = useState(false);
  const [editingFossil, setEditingFossil] = useState<Fossil | null>(null);
  const [fossilForm, setFossilForm] = useState({
    name: '',
    fossil_type: '',
    era: '',
    age_in_years: 0,
    description: '',
    origin_location: '',
    image_url: '',
    model_3d_embed: '',
    audio_story_url: '',
  });

  // Analytics state
  const [visitStats, setVisitStats] = useState<any>(null);

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<HighScore[]>([]);
  const [selectedGameMode, setSelectedGameMode] = useState<string>('');

  // Feedback state
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);

  // Load user and initial data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const userData = await userAPI.getMe();
        
        if (!userData.is_admin) {
          navigate('/dashboard');
          return;
        }
        
        setUser(userData);
      } catch (err) {
        console.error('Error loading user:', err);
        setError('Failed to load user data');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  // Load temples
  useEffect(() => {
    const loadTemples = async () => {
      try {
        const data = await contentAPI.getAllTemples();
        setTemples(data);
      } catch (err) {
        console.error('Error loading temples:', err);
        setError('Failed to load temples');
      }
    };

    if (activeTab === 'temples') {
      loadTemples();
    }
  }, [activeTab]);

  // Load weapons
  useEffect(() => {
    const loadWeapons = async () => {
      try {
        const data = await contentAPI.getAllWeapons();
        setWeapons(data);
      } catch (err) {
        console.error('Error loading weapons:', err);
        setError('Failed to load weapons');
      }
    };

    if (activeTab === 'weapons') {
      loadWeapons();
    }
  }, [activeTab]);

  // Load fossils
  useEffect(() => {
    const loadFossils = async () => {
      try {
        const data = await contentAPI.getAllFossils();
        setFossils(data);
      } catch (err) {
        console.error('Error loading fossils:', err);
        setError('Failed to load fossils');
      }
    };

    if (activeTab === 'fossils') {
      loadFossils();
    }
  }, [activeTab]);

  // Load analytics with real-time refresh
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const stats = await adminAPI.getVisitStats();
        setVisitStats(stats);
      } catch (err) {
        console.error('Error loading analytics:', err);
        setError('Failed to load analytics');
      }
    };

    if (activeTab === 'analytics') {
      loadAnalytics();
      // Refresh analytics every 5 seconds for real-time updates
      const intervalId = setInterval(loadAnalytics, 5000);
      return () => clearInterval(intervalId);
    }
  }, [activeTab]);

  // Load leaderboard
  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const mode = selectedGameMode || undefined;
        const data = await adminAPI.getLeaderboardAdmin(mode, 100);
        console.log('Leaderboard data loaded:', data);
        setLeaderboard(data);
      } catch (err) {
        console.error('Error loading leaderboard:', err);
        setError('Failed to load leaderboard');
      }
    };

    if (activeTab === 'leaderboard') {
      loadLeaderboard();
    }
  }, [activeTab, selectedGameMode]);

  // Load feedback with real-time refresh
  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const data = await adminAPI.getAllFeedback(200);
        console.log('Feedback data loaded:', data);
        setFeedbackList(data);
      } catch (err) {
        console.error('Error loading feedback:', err);
        setError('Failed to load feedback');
      }
    };

    if (activeTab === 'feedback') {
      loadFeedback();
      // Refresh feedback every 10 seconds for real-time updates
      const intervalId = setInterval(loadFeedback, 10000);
      return () => clearInterval(intervalId);
    }
  }, [activeTab]);

  // Temple handlers
  const handleSaveTemple = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!templeForm.name || !templeForm.dynasty || !templeForm.builder) {
      setError('Please fill in Name, Dynasty, and Builder fields');
      return;
    }
    
    try {
      // Auto-convert description to JSON format
      const templeData = {
        ...templeForm,
        historical_significance: convertToJSON(templeForm.historical_significance)
      };
      
      if (editingTemple) {
        const updatedTemple = await adminAPI.updateTemple(editingTemple.id!, templeData);
        // Real-time update: Replace the old temple with updated one
        setTemples(temples.map(t => t.id === editingTemple.id ? updatedTemple : t));
        alert('✅ Temple updated successfully!');
        setEditingTemple(null);
      } else {
        const newTemple = await adminAPI.createTemple(templeData);
        // Real-time update: Add new temple to the beginning of the list
        setTemples([newTemple, ...temples]);
        alert('✅ Temple added successfully!');
      }
      
      // Reset form
      setTempleForm({
        name: '',
        dynasty: '',
        builder: '',
        time_period: '',
        historical_significance: '',
        weapon_used: '',
        static_image_url: '',
        model_3d_embed: '',
        audio_story_url: '',
      });
      setShowAddTempleForm(false);
      setError(null);
    } catch (err: any) {
      console.error('Error saving temple:', err);
      const errorMsg = err.response?.data?.detail || 'Failed to save temple';
      setError(errorMsg);
      alert('❌ ' + errorMsg);
    }
  };

  const handleDeleteTemple = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this temple?')) {
      try {
        console.log('Deleting temple with ID:', id);
        const result = await adminAPI.deleteTemple(id);
        console.log('Delete result:', result);
        setTemples(temples.filter(t => t.id !== id));
        setError(null);
        alert('Temple deleted successfully!');
      } catch (err: any) {
        console.error('Error deleting temple:', err);
        console.error('Error response:', err.response?.data);
        setError(err.response?.data?.detail || 'Failed to delete temple');
        alert('Failed to delete temple: ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  // Weapon handlers
  const handleSaveWeapon = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!weaponForm.name || !weaponForm.type) {
      setError('Please fill in Name and Type fields');
      return;
    }
    
    try {
      // Auto-convert description to JSON format
      const weaponData = {
        ...weaponForm,
        description: convertToJSON(weaponForm.description)
      };
      
      if (editingWeapon) {
        const updatedWeapon = await adminAPI.updateWeapon(editingWeapon.id!, weaponData);
        // Real-time update: Replace the old weapon with updated one
        setWeapons(weapons.map(w => w.id === editingWeapon.id ? updatedWeapon : w));
        alert('✅ Weapon updated successfully!');
        setEditingWeapon(null);
      } else {
        const newWeapon = await adminAPI.createWeapon(weaponData);
        // Real-time update: Add new weapon to the beginning of the list
        setWeapons([newWeapon, ...weapons]);
        alert('✅ Weapon added successfully!');
      }
      
      // Reset form
      setWeaponForm({
        name: '',
        dynasty_context: [],
        type: '',
        description: '',
        image_url: '',
        model_3d_embed: '',
        audio_story_url: '',
      });
      setShowAddWeaponForm(false);
      setError(null);
    } catch (err: any) {
      console.error('Error saving weapon:', err);
      const errorMsg = err.response?.data?.detail || 'Failed to save weapon';
      setError(errorMsg);
      alert('❌ ' + errorMsg);
    }
  };

  const handleDeleteWeapon = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this weapon?')) {
      try {
        console.log('Deleting weapon with ID:', id);
        const result = await adminAPI.deleteWeapon(id);
        console.log('Delete result:', result);
        setWeapons(weapons.filter(w => w.id !== id));
        setError(null);
        alert('Weapon deleted successfully!');
      } catch (err: any) {
        console.error('Error deleting weapon:', err);
        console.error('Error response:', err.response?.data);
        setError(err.response?.data?.detail || 'Failed to delete weapon');
        alert('Failed to delete weapon: ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  const handleAddFossil = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!fossilForm.name || !fossilForm.fossil_type || !fossilForm.era) {
      setError('Please fill in Name, Type, and Era fields');
      return;
    }
    
    try {
      // Auto-convert description to JSON format
      const fossilData = {
        ...fossilForm,
        description: convertToJSON(fossilForm.description)
      };
      
      if (editingFossil) {
        const updatedFossil = await adminAPI.updateFossil(editingFossil.id, fossilData);
        // Real-time update: Replace the old fossil with updated one
        setFossils(fossils.map(f => f.id === editingFossil.id ? updatedFossil : f));
        alert('✅ Fossil updated successfully!');
        setEditingFossil(null);
      } else {
        const newFossil = await adminAPI.createFossil(fossilData);
        // Real-time update: Add new fossil to the beginning of the list
        setFossils([newFossil, ...fossils]);
        alert('✅ Fossil added successfully!');
      }
      
      // Reset form
      setFossilForm({
        name: '',
        fossil_type: '',
        era: '',
        age_in_years: 0,
        description: '',
        origin_location: '',
        image_url: '',
        model_3d_embed: '',
        audio_story_url: '',
      });
      setShowAddFossilForm(false);
      setError(null);
    } catch (err: any) {
      console.error('Error saving fossil:', err);
      const errorMsg = err.response?.data?.detail || 'Failed to save fossil';
      setError(errorMsg);
      alert('❌ ' + errorMsg);
    }
  };

  const handleDeleteFossil = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this fossil?')) {
      try {
        console.log('Deleting fossil with ID:', id);
        const result = await adminAPI.deleteFossil(id);
        console.log('Delete result:', result);
        setFossils(fossils.filter(f => f.id !== id));
        setError(null);
        alert('Fossil deleted successfully!');
      } catch (err: any) {
        console.error('Error deleting fossil:', err);
        console.error('Error response:', err.response?.data);
        setError(err.response?.data?.detail || 'Failed to delete fossil');
        alert('Failed to delete fossil: ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user?.is_admin) {
    return (
      <div className="admin-dashboard">
        <div className="unauthorized">
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <h1>⚙️ Admin Dashboard</h1>
        <div className="admin-info">
          <span>👤 {user.email}</span>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Navigation Tabs */}
      <div className="admin-nav">
        <button
          className={`nav-tab ${activeTab === 'temples' ? 'active' : ''}`}
          onClick={() => setActiveTab('temples')}
        >
          🕌 Temples
        </button>
        <button
          className={`nav-tab ${activeTab === 'weapons' ? 'active' : ''}`}
          onClick={() => setActiveTab('weapons')}
        >
          ⚔️ Weapons
        </button>
        <button
          className={`nav-tab ${activeTab === 'fossils' ? 'active' : ''}`}
          onClick={() => setActiveTab('fossils')}
        >
          🦴 Fossils
        </button>
        <button
          className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
        <button
          className={`nav-tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          🏆 Leaderboard
        </button>
        <button
          className={`nav-tab ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          💬 Feedback
        </button>
      </div>

      {/* Tab Content */}
      <div className="admin-content">
        {/* Temples Tab */}
        {activeTab === 'temples' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>🕌 Temple Management</h2>
              <button className="btn-add" onClick={() => setShowAddTempleForm(true)}>
                ➕ Add Temple
              </button>
            </div>
            <div className="content-list">
              {temples.length === 0 ? (
                <p className="empty-state">No temples yet. Add one to get started!</p>
              ) : (
                temples.map((temple) => (
                  <div key={temple.id} className="content-card">
                    <div className="content-info">
                      <h3>{temple.name}</h3>
                      <p><strong>Builder:</strong> {temple.builder}</p>
                      <p><strong>Dynasty:</strong> {temple.dynasty}</p>
                      <p><strong>Period:</strong> {temple.time_period}</p>
                    </div>
                    <div className="content-actions">
                      <button onClick={() => {
                        setEditingTemple(temple);
                        setTempleForm({
                          name: temple.name,
                          dynasty: temple.dynasty,
                          builder: temple.builder,
                          time_period: temple.time_period,
                          historical_significance: convertFromJSON(temple.historical_significance),
                          weapon_used: temple.weapon_used,
                          static_image_url: temple.static_image_url,
                          model_3d_embed: temple.model_3d_embed || '',
                          audio_story_url: temple.audio_story_url || '',
                        });
                        setShowAddTempleForm(true);
                      }}>✏️ Edit</button>
                      <button onClick={() => handleDeleteTemple(temple.id!)}>🗑️ Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {showAddTempleForm && (
              <div className="modal-overlay" onClick={() => setShowAddTempleForm(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3>{editingTemple ? 'Edit Temple' : 'Add New Temple'}</h3>
                  <form onSubmit={handleSaveTemple}>
                    <input
                      type="text"
                      placeholder="Temple Name"
                      value={templeForm.name}
                      onChange={(e) => setTempleForm({ ...templeForm, name: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Builder (e.g., Raja Raja Chola I)"
                      value={templeForm.builder}
                      onChange={(e) => setTempleForm({ ...templeForm, builder: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Dynasty"
                      value={templeForm.dynasty}
                      onChange={(e) => setTempleForm({ ...templeForm, dynasty: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Time Period (e.g., 11th Century AD)"
                      value={templeForm.time_period}
                      onChange={(e) => setTempleForm({ ...templeForm, time_period: e.target.value })}
                      required
                    />
                    <textarea
                      placeholder="Historical Significance (plain text or any format)"
                      value={templeForm.historical_significance}
                      onChange={(e) => setTempleForm({ ...templeForm, historical_significance: e.target.value })}
                      rows={3}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Weapon Used (e.g., Mace and Battle Axe)"
                      value={templeForm.weapon_used}
                      onChange={(e) => setTempleForm({ ...templeForm, weapon_used: e.target.value })}
                      required
                    />

                    <input
                      type="text"
                      placeholder="Static Image URL or Path (e.g., /static/images/temples/temple1.jpg)"
                      value={templeForm.static_image_url}
                      onChange={(e) => setTempleForm({ ...templeForm, static_image_url: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="3D Model Embed ID"
                      value={templeForm.model_3d_embed}
                      onChange={(e) => setTempleForm({ ...templeForm, model_3d_embed: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Audio Story URL or Path (e.g., /static/audio/temples/temple1.mp3)"
                      value={templeForm.audio_story_url}
                      onChange={(e) => setTempleForm({ ...templeForm, audio_story_url: e.target.value })}
                    />
                    <div className="modal-actions">
                      <button type="button" onClick={() => {
                        setShowAddTempleForm(false);
                        setEditingTemple(null);
                      }}>Cancel</button>
                      <button type="submit">💾 Save</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Weapons Tab */}
        {activeTab === 'weapons' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>⚔️ Weapon Management</h2>
              <button className="btn-add" onClick={() => setShowAddWeaponForm(true)}>
                ➕ Add Weapon
              </button>
            </div>
            <div className="content-list">
              {weapons.length === 0 ? (
                <p className="empty-state">No weapons yet. Add one to get started!</p>
              ) : (
                weapons.map((weapon) => (
                  <div key={weapon.id} className="content-card">
                    <div className="content-info">
                      <h3>{weapon.name}</h3>
                      <p><strong>Type:</strong> {weapon.type}</p>
                      <p><strong>Dynasty Context:</strong> {Array.isArray(weapon.dynasty_context) ? weapon.dynasty_context.join(', ') : weapon.dynasty_context}</p>
                    </div>
                    <div className="content-actions">
                      <button onClick={() => {
                        setEditingWeapon(weapon);
                        setWeaponForm({
                          name: weapon.name,
                          dynasty_context: Array.isArray(weapon.dynasty_context) ? weapon.dynasty_context : [],
                          type: weapon.type,
                          description: convertFromJSON(weapon.description),
                          image_url: weapon.image_url,
                          model_3d_embed: weapon.model_3d_embed || '',
                          audio_story_url: weapon.audio_story_url || '',
                        });
                        setShowAddWeaponForm(true);
                      }}>✏️ Edit</button>
                      <button onClick={() => handleDeleteWeapon(weapon.id!)}>🗑️ Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {showAddWeaponForm && (
              <div className="modal-overlay" onClick={() => setShowAddWeaponForm(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3>{editingWeapon ? 'Edit Weapon' : 'Add New Weapon'}</h3>
                  <form onSubmit={handleSaveWeapon}>
                    <input
                      type="text"
                      placeholder="Weapon Name"
                      value={weaponForm.name}
                      onChange={(e) => setWeaponForm({ ...weaponForm, name: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Type (e.g., Sword, Bow, Mace)"
                      value={weaponForm.type}
                      onChange={(e) => setWeaponForm({ ...weaponForm, type: e.target.value })}
                      required
                    />
                    <textarea
                      placeholder="Dynasty Context (comma-separated list)"
                      value={weaponForm.dynasty_context.join(', ')}
                      onChange={(e) => setWeaponForm({ ...weaponForm, dynasty_context: e.target.value.split(',').map(s => s.trim()) })}
                      rows={2}
                      required
                    />


                    <textarea
                      placeholder="Description (plain text or any format)"
                      value={weaponForm.description}
                      onChange={(e) => setWeaponForm({ ...weaponForm, description: e.target.value })}
                      rows={4}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Image URL or Path (e.g., /static/images/weapons/sword1.jpg)"
                      value={weaponForm.image_url}
                      onChange={(e) => setWeaponForm({ ...weaponForm, image_url: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="3D Model Embed ID"
                      value={weaponForm.model_3d_embed}
                      onChange={(e) => setWeaponForm({ ...weaponForm, model_3d_embed: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Audio Story URL or Path (e.g., /static/audio/weapons/sword1.mp3)"
                      value={weaponForm.audio_story_url}
                      onChange={(e) => setWeaponForm({ ...weaponForm, audio_story_url: e.target.value })}
                    />
                    <div className="modal-actions">
                      <button type="button" onClick={() => {
                        setShowAddWeaponForm(false);
                        setEditingWeapon(null);
                      }}>Cancel</button>
                      <button type="submit">💾 Save</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fossils Tab */}
        {activeTab === 'fossils' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Fossil Management</h2>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setShowAddFossilForm(!showAddFossilForm);
                  setEditingFossil(null);
                }}
              >
                {showAddFossilForm ? 'Cancel' : '+ Add New Fossil'}
              </button>
            </div>

            {showAddFossilForm && (
              <form className="fossil-form" onSubmit={handleAddFossil}>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Fossil Name"
                    value={fossilForm.name}
                    onChange={(e) => setFossilForm({...fossilForm, name: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Fossil Type"
                    value={fossilForm.fossil_type}
                    onChange={(e) => setFossilForm({...fossilForm, fossil_type: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Era (e.g., Jurassic, Cretaceous)"
                    value={fossilForm.era}
                    onChange={(e) => setFossilForm({...fossilForm, era: e.target.value})}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Age in Years"
                    value={fossilForm.age_in_years}
                    onChange={(e) => setFossilForm({...fossilForm, age_in_years: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Origin Location"
                    value={fossilForm.origin_location}
                    onChange={(e) => setFossilForm({...fossilForm, origin_location: e.target.value})}
                    required
                  />
                </div>
                <textarea
                  placeholder="Description (plain text or any format)"
                  value={fossilForm.description}
                  onChange={(e) => setFossilForm({...fossilForm, description: e.target.value})}
                  rows={3}
                  required
                ></textarea>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Image URL or Path (e.g., /static/images/animals/fossil1.jpg)"
                    value={fossilForm.image_url}
                    onChange={(e) => setFossilForm({...fossilForm, image_url: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="3D Model Embed (Sketchfab ID)"
                    value={fossilForm.model_3d_embed}
                    onChange={(e) => setFossilForm({...fossilForm, model_3d_embed: e.target.value})}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Audio Story URL or Path (e.g., /static/audio/animals/fossil1.mp3)"
                  value={fossilForm.audio_story_url}
                  onChange={(e) => setFossilForm({...fossilForm, audio_story_url: e.target.value})}
                  required
                />
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingFossil ? 'Update Fossil' : 'Add Fossil'}
                  </button>
                </div>
              </form>
            )}

            <div className="fossils-list">
              {fossils.length === 0 ? (
                <p className="empty-state">No fossils yet. Add one to get started!</p>
              ) : (
                fossils.map((fossil) => (
                  <div key={fossil.id} className="fossil-item">
                    <div className="fossil-header">
                      <h3>{fossil.name}</h3>
                      <div className="fossil-actions">
                        <button 
                          className="btn btn-secondary"
                          onClick={() => {
                            setEditingFossil(fossil);
                            setFossilForm({
                              name: fossil.name,
                              fossil_type: fossil.fossil_type,
                              era: fossil.era,
                              age_in_years: fossil.age_in_years,
                              description: convertFromJSON(fossil.description),
                              origin_location: fossil.origin_location,
                              image_url: fossil.image_url,
                              model_3d_embed: fossil.model_3d_embed || '',
                              audio_story_url: fossil.audio_story_url,
                            });
                            setShowAddFossilForm(true);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleDeleteFossil(fossil.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p><strong>Type:</strong> {fossil.fossil_type}</p>
                    <p><strong>Era:</strong> {fossil.era} (~{fossil.age_in_years} years ago)</p>
                    <p><strong>Origin:</strong> {fossil.origin_location}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="tab-content">
            <h2>Visit Analytics</h2>
            {visitStats ? (
              <div className="analytics-grid">
                <div className="stat-card">
                  <div className="stat-value">{visitStats.total_visits || 0}</div>
                  <div className="stat-label">Total Visits</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{visitStats.unique_users || 0}</div>
                  <div className="stat-label">Unique Users</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{visitStats.average_visit_duration || 0}</div>
                  <div className="stat-label">Avg. Duration (min)</div>
                </div>
              </div>
            ) : (
              <p className="empty-state">No analytics data available yet.</p>
            )}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Leaderboard</h2>
              <select 
                value={selectedGameMode}
                onChange={(e) => setSelectedGameMode(e.target.value)}
                className="filter-select"
              >
                <option value="">All Games</option>
                <option value="temples-easy">Temples (Easy)</option>
                <option value="temples-medium">Temples (Medium)</option>
                <option value="temples-hard">Temples (Hard)</option>
                <option value="weapons-easy">Weapons (Easy)</option>
                <option value="weapons-medium">Weapons (Medium)</option>
                <option value="weapons-hard">Weapons (Hard)</option>
                <option value="fossils-easy">Fossils (Easy)</option>
                <option value="fossils-medium">Fossils (Medium)</option>
                <option value="fossils-hard">Fossils (Hard)</option>
              </select>
            </div>

            {leaderboard.length === 0 ? (
              <p className="empty-state">No leaderboard data yet.</p>
            ) : (
              <div className="leaderboard-table">
                <div className="table-header">
                  <div className="col-rank">Rank</div>
                  <div className="col-user">User</div>
                  <div className="col-score">Score</div>
                  <div className="col-mode">Mode</div>
                  <div className="col-date">Date</div>
                </div>
                {leaderboard.map((entry, index) => (
                  <div key={`${entry.user_id}-${entry.achieved_at}`} className="table-row">
                    <div className="col-rank">#{index + 1}</div>
                    <div className="col-user">User #{entry.user_id}</div>
                    <div className="col-score">{entry.score}</div>
                    <div className="col-mode">{entry.game_mode}</div>
                    <div className="col-date">{new Date(entry.achieved_at).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <div className="tab-content">
            <h2>User Feedback ({feedbackList.length})</h2>
            {feedbackList.length === 0 ? (
              <p className="empty-state">No feedback yet.</p>
            ) : (
              <div className="feedback-list">
                {feedbackList.map((feedback) => (
                  <div key={feedback.id} className="feedback-card">
                    <div className="feedback-rating">
                      {'★'.repeat(feedback.rating)}{'☆'.repeat(5 - feedback.rating)}
                    </div>
                    <div className="feedback-user">User #{feedback.user_id}</div>
                    <div className="feedback-message">{feedback.message}</div>
                    <div className="feedback-date">
                      {new Date(feedback.submitted_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
