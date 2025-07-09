import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Settings, 
  Upload, 
  Download, 
  Moon, 
  Sun, 
  GripVertical,
  Eye,
  EyeOff,
  Lock,
  X
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  iconUrl?: string;
  color?: string;
}

interface ProfileData {
  username: string;
  tagline: string;
  profileImage: string;
  links: LinkItem[];
  darkMode: boolean;
}

const defaultProfile: ProfileData = {
  username: "CodeNinjaVik",
  tagline: "Developer • Content Creator • Tech Enthusiast",
  profileImage: "/lovable-uploads/4d946d6d-2c54-41f2-850c-b9d435bbf7a7.png",
  links: [
    {
      id: '1',
      title: 'GyaanRepo Website',
      url: 'https://gyaanrepo.netlify.app/',
      iconUrl: '/src/assets/gyaanrepo-logo.jpg',
      color: 'purple'
    },
    {
      id: '2',
      title: 'Telegram Channel',
      url: 'https://t.me/gyaanRepo',
      color: 'blue'
    },
    {
      id: '3',
      title: 'GitHub Profile',
      url: 'https://github.com/vikashkumar14',
      color: 'gray'
    },
    {
      id: '4',
      title: 'YouTube Channel',
      url: 'https://youtube.com/@theeditorstar12?si=FP4yAjH0T2a33833',
      color: 'red'
    },
    {
      id: '5',
      title: 'Instagram',
      url: 'https://instagram.com/codeninjavik',
      color: 'pink'
    }
  ],
  darkMode: true
};

const ADMIN_PASSWORD = "vikas123";

const AdvancedBioLink: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLink, setNewLink] = useState<Partial<LinkItem>>({});

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('biolink-profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  // Save to localStorage whenever profile changes
  useEffect(() => {
    localStorage.setItem('biolink-profile', JSON.stringify(profile));
  }, [profile]);

  const handleAdminLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminMode(true);
      setShowAdminLogin(false);
      setPassword('');
    } else {
      alert('Incorrect password!');
    }
  };

  const handleLogout = () => {
    setIsAdminMode(false);
    setShowAddForm(false);
    setEditingLink(null);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(profile.links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setProfile(prev => ({ ...prev, links: items }));
  };

  const addLink = () => {
    if (!newLink.title || !newLink.url) return;

    const link: LinkItem = {
      id: Date.now().toString(),
      title: newLink.title,
      url: newLink.url,
      iconUrl: newLink.iconUrl,
      color: newLink.color || 'purple'
    };

    setProfile(prev => ({ ...prev, links: [...prev.links, link] }));
    setNewLink({});
    setShowAddForm(false);
  };

  const updateLink = () => {
    if (!editingLink || !editingLink.title || !editingLink.url) return;

    setProfile(prev => ({
      ...prev,
      links: prev.links.map(link => 
        link.id === editingLink.id ? editingLink : link
      )
    }));
    setEditingLink(null);
  };

  const deleteLink = (id: string) => {
    setProfile(prev => ({
      ...prev,
      links: prev.links.filter(link => link.id !== id)
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, profileImage: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(profile, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'biolink-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          setProfile(importedData);
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const toggleDarkMode = () => {
    setProfile(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 hover:border-purple-400/50',
      blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 hover:border-blue-400/50',
      red: 'from-red-500/20 to-red-600/20 border-red-500/30 hover:border-red-400/50',
      pink: 'from-pink-500/20 to-pink-600/20 border-pink-500/30 hover:border-pink-400/50',
      gray: 'from-gray-500/20 to-gray-600/20 border-gray-500/30 hover:border-gray-400/50',
      green: 'from-green-500/20 to-green-600/20 border-green-500/30 hover:border-green-400/50'
    };
    return colors[color as keyof typeof colors] || colors.purple;
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      profile.darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-md">
        
        {/* Header Controls */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full backdrop-blur-lg border transition-all ${
              profile.darkMode 
                ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                : 'bg-black/10 border-black/20 text-black hover:bg-black/20'
            }`}
          >
            {profile.darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setShowAdminLogin(true)}
            className={`p-2 rounded-full backdrop-blur-lg border transition-all ${
              profile.darkMode 
                ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                : 'bg-black/10 border-black/20 text-black hover:bg-black/20'
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6 group">
            <img
              src={profile.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-500/50 shadow-2xl"
            />
            {isAdminMode && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <Upload className="w-8 h-8 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          
          {isAdminMode ? (
            <div className="space-y-3">
              <input
                type="text"
                value={profile.username}
                onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                className={`text-3xl font-bold text-center w-full bg-transparent border-b-2 border-dashed focus:outline-none ${
                  profile.darkMode ? 'text-white border-white/30' : 'text-black border-black/30'
                }`}
              />
              <textarea
                value={profile.tagline}
                onChange={(e) => setProfile(prev => ({ ...prev, tagline: e.target.value }))}
                className={`text-center w-full bg-transparent border-b-2 border-dashed focus:outline-none resize-none ${
                  profile.darkMode ? 'text-gray-300 border-white/30' : 'text-gray-600 border-black/30'
                }`}
              />
            </div>
          ) : (
            <>
              <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}>
                {profile.username}
              </h1>
              <p className={`${profile.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {profile.tagline}
              </p>
            </>
          )}
        </div>

        {/* Links Section */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="links">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 mb-8">
                {profile.links.map((link, index) => (
                  <Draggable key={link.id} draggableId={link.id} index={index} isDragDisabled={!isAdminMode}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`group relative backdrop-blur-xl rounded-2xl p-4 border transition-all duration-300 hover:scale-[1.02] ${
                          snapshot.isDragging ? 'rotate-3 shadow-2xl' : ''
                        } bg-gradient-to-r ${getColorClasses(link.color || 'purple')} ${
                          profile.darkMode ? 'shadow-lg' : 'shadow-md'
                        }`}
                      >
                        <div className="flex items-center">
                          {isAdminMode && (
                            <div {...provided.dragHandleProps} className="mr-3 cursor-grab active:cursor-grabbing">
                              <GripVertical className={`w-5 h-5 ${profile.darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                            </div>
                          )}
                          
                          {link.iconUrl && (
                            <img src={link.iconUrl} alt="" className="w-8 h-8 rounded-lg mr-4" />
                          )}
                          
                          <div className="flex-1">
                            <h3 className={`font-semibold ${profile.darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {link.title}
                            </h3>
                          </div>

                          {isAdminMode ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditingLink(link)}
                                className={`p-2 rounded-lg transition-colors ${
                                  profile.darkMode 
                                    ? 'hover:bg-white/10 text-gray-300 hover:text-white' 
                                    : 'hover:bg-black/10 text-gray-600 hover:text-black'
                                }`}
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteLink(link.id)}
                                className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => window.open(link.url, '_blank')}
                              className={`p-2 rounded-lg transition-all group-hover:scale-110 ${
                                profile.darkMode 
                                  ? 'text-gray-400 hover:text-white' 
                                  : 'text-gray-600 hover:text-black'
                              }`}
                            >
                              <span className="text-sm">→</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Admin Controls */}
        {isAdminMode && (
          <div className="space-y-4 mb-8">
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 hover:border-green-400/50 transition-all flex items-center justify-center text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Link
            </button>

            <div className="flex space-x-3">
              <button
                onClick={exportData}
                className={`flex-1 p-3 rounded-xl backdrop-blur-xl border transition-all ${
                  profile.darkMode 
                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                    : 'bg-black/10 border-black/20 text-black hover:bg-black/20'
                }`}
              >
                <Download className="w-4 h-4 mx-auto" />
              </button>
              
              <label className={`flex-1 p-3 rounded-xl backdrop-blur-xl border transition-all cursor-pointer ${
                profile.darkMode 
                  ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                  : 'bg-black/10 border-black/20 text-black hover:bg-black/20'
              }`}>
                <Upload className="w-4 h-4 mx-auto" />
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleLogout}
                className="flex-1 p-3 rounded-xl backdrop-blur-xl bg-red-500/20 border border-red-500/30 hover:border-red-400/50 text-red-400 hover:text-red-300 transition-all"
              >
                <EyeOff className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        )}

        {/* Admin Login Modal */}
        {showAdminLogin && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-sm rounded-2xl p-6 backdrop-blur-xl border ${
              profile.darkMode 
                ? 'bg-gray-900/80 border-white/20' 
                : 'bg-white/80 border-black/20'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-bold ${profile.darkMode ? 'text-white' : 'text-black'}`}>
                  Admin Login
                </h3>
                <button
                  onClick={() => setShowAdminLogin(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    profile.darkMode 
                      ? 'hover:bg-white/10 text-gray-400' 
                      : 'hover:bg-black/10 text-gray-600'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                  className={`w-full p-3 rounded-xl backdrop-blur-xl border transition-all ${
                    profile.darkMode 
                      ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400' 
                      : 'bg-black/10 border-black/20 text-black placeholder:text-gray-600'
                  }`}
                />
                <button
                  onClick={handleAdminLogin}
                  className="w-full p-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white transition-colors"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Link Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-sm rounded-2xl p-6 backdrop-blur-xl border ${
              profile.darkMode 
                ? 'bg-gray-900/80 border-white/20' 
                : 'bg-white/80 border-black/20'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-bold ${profile.darkMode ? 'text-white' : 'text-black'}`}>
                  Add New Link
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    profile.darkMode 
                      ? 'hover:bg-white/10 text-gray-400' 
                      : 'hover:bg-black/10 text-gray-600'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Link title"
                  value={newLink.title || ''}
                  onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full p-3 rounded-xl backdrop-blur-xl border transition-all ${
                    profile.darkMode 
                      ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400' 
                      : 'bg-black/10 border-black/20 text-black placeholder:text-gray-600'
                  }`}
                />
                <input
                  type="url"
                  placeholder="Link URL"
                  value={newLink.url || ''}
                  onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                  className={`w-full p-3 rounded-xl backdrop-blur-xl border transition-all ${
                    profile.darkMode 
                      ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400' 
                      : 'bg-black/10 border-black/20 text-black placeholder:text-gray-600'
                  }`}
                />
                <input
                  type="url"
                  placeholder="Icon URL (optional)"
                  value={newLink.iconUrl || ''}
                  onChange={(e) => setNewLink(prev => ({ ...prev, iconUrl: e.target.value }))}
                  className={`w-full p-3 rounded-xl backdrop-blur-xl border transition-all ${
                    profile.darkMode 
                      ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400' 
                      : 'bg-black/10 border-black/20 text-black placeholder:text-gray-600'
                  }`}
                />
                <select
                  value={newLink.color || 'purple'}
                  onChange={(e) => setNewLink(prev => ({ ...prev, color: e.target.value }))}
                  className={`w-full p-3 rounded-xl backdrop-blur-xl border transition-all ${
                    profile.darkMode 
                      ? 'bg-white/10 border-white/20 text-white' 
                      : 'bg-black/10 border-black/20 text-black'
                  }`}
                >
                  <option value="purple">Purple</option>
                  <option value="blue">Blue</option>
                  <option value="red">Red</option>
                  <option value="pink">Pink</option>
                  <option value="gray">Gray</option>
                  <option value="green">Green</option>
                </select>
                <button
                  onClick={addLink}
                  className="w-full p-3 rounded-xl bg-green-500 hover:bg-green-600 text-white transition-colors"
                >
                  Add Link
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Link Modal */}
        {editingLink && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-sm rounded-2xl p-6 backdrop-blur-xl border ${
              profile.darkMode 
                ? 'bg-gray-900/80 border-white/20' 
                : 'bg-white/80 border-black/20'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-bold ${profile.darkMode ? 'text-white' : 'text-black'}`}>
                  Edit Link
                </h3>
                <button
                  onClick={() => setEditingLink(null)}
                  className={`p-2 rounded-lg transition-colors ${
                    profile.darkMode 
                      ? 'hover:bg-white/10 text-gray-400' 
                      : 'hover:bg-black/10 text-gray-600'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Link title"
                  value={editingLink.title}
                  onChange={(e) => setEditingLink(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className={`w-full p-3 rounded-xl backdrop-blur-xl border transition-all ${
                    profile.darkMode 
                      ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400' 
                      : 'bg-black/10 border-black/20 text-black placeholder:text-gray-600'
                  }`}
                />
                <input
                  type="url"
                  placeholder="Link URL"
                  value={editingLink.url}
                  onChange={(e) => setEditingLink(prev => prev ? { ...prev, url: e.target.value } : null)}
                  className={`w-full p-3 rounded-xl backdrop-blur-xl border transition-all ${
                    profile.darkMode 
                      ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400' 
                      : 'bg-black/10 border-black/20 text-black placeholder:text-gray-600'
                  }`}
                />
                <input
                  type="url"
                  placeholder="Icon URL (optional)"
                  value={editingLink.iconUrl || ''}
                  onChange={(e) => setEditingLink(prev => prev ? { ...prev, iconUrl: e.target.value } : null)}
                  className={`w-full p-3 rounded-xl backdrop-blur-xl border transition-all ${
                    profile.darkMode 
                      ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400' 
                      : 'bg-black/10 border-black/20 text-black placeholder:text-gray-600'
                  }`}
                />
                <select
                  value={editingLink.color || 'purple'}
                  onChange={(e) => setEditingLink(prev => prev ? { ...prev, color: e.target.value } : null)}
                  className={`w-full p-3 rounded-xl backdrop-blur-xl border transition-all ${
                    profile.darkMode 
                      ? 'bg-white/10 border-white/20 text-white' 
                      : 'bg-black/10 border-black/20 text-black'
                  }`}
                >
                  <option value="purple">Purple</option>
                  <option value="blue">Blue</option>
                  <option value="red">Red</option>
                  <option value="pink">Pink</option>
                  <option value="gray">Gray</option>
                  <option value="green">Green</option>
                </select>
                <button
                  onClick={updateLink}
                  className="w-full p-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                >
                  Update Link
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center">
          <div className={`inline-block px-4 py-2 rounded-full backdrop-blur-xl border ${
            profile.darkMode 
              ? 'bg-white/10 border-white/20 text-gray-300' 
              : 'bg-black/10 border-black/20 text-gray-600'
          }`}>
            <p className="text-sm">
              Built with ❤️ using React
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedBioLink;