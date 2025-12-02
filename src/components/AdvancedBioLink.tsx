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
  EyeOff,
  X,
  Send,
  Github,
  Youtube,
  Instagram,
  Globe,
  ExternalLink,
  Sparkles,
  Twitter,
  Linkedin,
  Music,
  Mail,
  Heart
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
      iconUrl: 'telegram',
      color: 'blue'
    },
    {
      id: '3',
      title: 'GitHub Profile',
      url: 'https://github.com/vikashkumar14',
      iconUrl: 'github',
      color: 'gray'
    },
    {
      id: '4',
      title: 'YouTube Channel',
      url: 'https://youtube.com/@theeditorstar12?si=FP4yAjH0T2a33833',
      iconUrl: 'youtube',
      color: 'red'
    },
    {
      id: '5',
      title: 'Instagram',
      url: 'https://instagram.com/codeninjavik',
      iconUrl: 'instagram',
      color: 'pink'
    }
  ],
  darkMode: true
};

const ADMIN_PASSWORD = "vikas123";

// Floating particles component
const FloatingParticles = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 rounded-full bg-purple-500/20 animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${3 + Math.random() * 4}s`,
        }}
      />
    ))}
  </div>
);

// Icon renderer component
const IconRenderer = ({ iconUrl, color }: { iconUrl?: string; color?: string }) => {
  const iconClass = "w-6 h-6";
  const iconColors: Record<string, string> = {
    telegram: "text-blue-400",
    github: "text-gray-300",
    youtube: "text-red-500",
    instagram: "text-pink-500",
    twitter: "text-sky-400",
    linkedin: "text-blue-500",
    music: "text-green-400",
    mail: "text-yellow-400",
    globe: "text-purple-400",
  };

  if (!iconUrl) {
    return <Globe className={`${iconClass} text-purple-400`} />;
  }

  if (iconUrl.startsWith('http') || iconUrl.startsWith('/')) {
    return <img src={iconUrl} alt="" className="w-10 h-10 rounded-xl object-cover" />;
  }

  const icons: Record<string, React.ReactNode> = {
    telegram: <Send className={`${iconClass} ${iconColors.telegram}`} />,
    github: <Github className={`${iconClass} ${iconColors.github}`} />,
    youtube: <Youtube className={`${iconClass} ${iconColors.youtube}`} />,
    instagram: <Instagram className={`${iconClass} ${iconColors.instagram}`} />,
    twitter: <Twitter className={`${iconClass} ${iconColors.twitter}`} />,
    linkedin: <Linkedin className={`${iconClass} ${iconColors.linkedin}`} />,
    music: <Music className={`${iconClass} ${iconColors.music}`} />,
    mail: <Mail className={`${iconClass} ${iconColors.mail}`} />,
    globe: <Globe className={`${iconClass} ${iconColors.globe}`} />,
  };

  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10`}>
      {icons[iconUrl] || <Globe className={`${iconClass} text-purple-400`} />}
    </div>
  );
};

const AdvancedBioLink: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLink, setNewLink] = useState<Partial<LinkItem>>({});

  useEffect(() => {
    const savedProfile = localStorage.getItem('biolink-profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

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
      links: prev.links.map(link => link.id === editingLink.id ? editingLink : link)
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
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'biolink-data.json');
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

  const getButtonGradient = (color: string) => {
    const gradients: Record<string, string> = {
      purple: 'from-purple-600/30 via-violet-500/20 to-purple-700/30 hover:from-purple-500/40 hover:via-violet-400/30 hover:to-purple-600/40',
      blue: 'from-blue-600/30 via-cyan-500/20 to-blue-700/30 hover:from-blue-500/40 hover:via-cyan-400/30 hover:to-blue-600/40',
      red: 'from-red-600/30 via-rose-500/20 to-red-700/30 hover:from-red-500/40 hover:via-rose-400/30 hover:to-red-600/40',
      pink: 'from-pink-600/30 via-fuchsia-500/20 to-pink-700/30 hover:from-pink-500/40 hover:via-fuchsia-400/30 hover:to-pink-600/40',
      gray: 'from-gray-600/30 via-slate-500/20 to-gray-700/30 hover:from-gray-500/40 hover:via-slate-400/30 hover:to-gray-600/40',
      green: 'from-emerald-600/30 via-green-500/20 to-emerald-700/30 hover:from-emerald-500/40 hover:via-green-400/30 hover:to-emerald-600/40'
    };
    return gradients[color] || gradients.purple;
  };

  const getGlowColor = (color: string) => {
    const glows: Record<string, string> = {
      purple: 'hover:shadow-purple-500/50',
      blue: 'hover:shadow-blue-500/50',
      red: 'hover:shadow-red-500/50',
      pink: 'hover:shadow-pink-500/50',
      gray: 'hover:shadow-gray-400/50',
      green: 'hover:shadow-emerald-500/50'
    };
    return glows[color] || glows.purple;
  };

  return (
    <div className={`min-h-screen relative transition-all duration-500 ${
      profile.darkMode 
        ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-gray-900 to-black' 
        : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100 via-blue-50 to-white'
    }`}>
      <FloatingParticles />
      
      <div className="container mx-auto px-4 py-8 max-w-md relative z-10">
        
        {/* Header Controls */}
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-2xl backdrop-blur-xl border-2 transition-all duration-300 hover:scale-110 ${
              profile.darkMode 
                ? 'bg-white/5 border-white/20 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/30' 
                : 'bg-black/5 border-black/20 text-indigo-600 hover:bg-indigo-500/20 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/30'
            }`}
          >
            {profile.darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => isAdminMode ? handleLogout() : setShowAdminLogin(true)}
            className={`p-3 rounded-2xl backdrop-blur-xl border-2 transition-all duration-300 hover:scale-110 ${
              isAdminMode
                ? 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30 hover:shadow-lg hover:shadow-red-500/30'
                : profile.darkMode 
                  ? 'bg-white/5 border-white/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/30' 
                  : 'bg-black/5 border-black/20 text-purple-600 hover:bg-purple-500/20 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/30'
            }`}
          >
            {isAdminMode ? <EyeOff className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
          </button>
        </div>

        {/* Profile Section */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            {/* Animated ring */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 animate-spin-slow opacity-75 blur-sm" />
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 opacity-50" />
            
            <div className="relative">
              <img
                src={profile.profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-2xl relative z-10"
              />
              {isAdminMode && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full cursor-pointer transition-all hover:bg-black/70 z-20">
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
            
            {/* Sparkle effect */}
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse z-20" />
          </div>
          
          {isAdminMode ? (
            <div className="space-y-3">
              <input
                type="text"
                value={profile.username}
                onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                className={`text-3xl font-bold text-center w-full bg-transparent border-b-2 border-dashed focus:outline-none focus:border-purple-500 transition-colors ${
                  profile.darkMode ? 'text-white border-white/30' : 'text-black border-black/30'
                }`}
              />
              <textarea
                value={profile.tagline}
                onChange={(e) => setProfile(prev => ({ ...prev, tagline: e.target.value }))}
                className={`text-center w-full bg-transparent border-b-2 border-dashed focus:outline-none focus:border-purple-500 transition-colors resize-none ${
                  profile.darkMode ? 'text-gray-300 border-white/30' : 'text-gray-600 border-black/30'
                }`}
              />
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                {profile.username}
              </h1>
              <p className={`text-lg ${profile.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
                        className={`group relative backdrop-blur-xl rounded-2xl p-5 border-2 transition-all duration-500 cursor-pointer
                          ${snapshot.isDragging ? 'rotate-2 scale-105' : 'hover:scale-[1.03] hover:-translate-y-1'}
                          bg-gradient-to-r ${getButtonGradient(link.color || 'purple')}
                          border-white/10 hover:border-white/30
                          shadow-lg hover:shadow-2xl ${getGlowColor(link.color || 'purple')}
                          ${profile.darkMode ? '' : 'bg-white/50'}
                        `}
                        onClick={() => !isAdminMode && window.open(link.url, '_blank')}
                      >
                        {/* Shine effect */}
                        <div className="absolute inset-0 rounded-2xl overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </div>
                        
                        <div className="flex items-center relative z-10">
                          {isAdminMode && (
                            <div {...provided.dragHandleProps} className="mr-3 cursor-grab active:cursor-grabbing">
                              <GripVertical className={`w-5 h-5 ${profile.darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            </div>
                          )}
                          
                          <div className="mr-4 flex-shrink-0">
                            <IconRenderer iconUrl={link.iconUrl} color={link.color} />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className={`font-bold text-lg ${profile.darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {link.title}
                            </h3>
                          </div>

                          {isAdminMode ? (
                            <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => setEditingLink(link)}
                                className={`p-2 rounded-xl transition-all hover:scale-110 ${
                                  profile.darkMode 
                                    ? 'hover:bg-white/10 text-gray-300 hover:text-white' 
                                    : 'hover:bg-black/10 text-gray-600 hover:text-black'
                                }`}
                              >
                                <Edit3 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => deleteLink(link.id)}
                                className="p-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all hover:scale-110"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <ExternalLink className={`w-5 h-5 transition-all group-hover:translate-x-1 ${
                              profile.darkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-black'
                            }`} />
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
          <div className="space-y-4 mb-8 animate-fade-in">
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-r from-emerald-500/30 via-green-500/20 to-teal-500/30 border-2 border-emerald-500/30 hover:border-emerald-400/50 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center text-white font-semibold"
            >
              <Plus className="w-6 h-6 mr-2" />
              Add New Link
            </button>

            <div className="flex space-x-3">
              <button
                onClick={exportData}
                className={`flex-1 p-4 rounded-2xl backdrop-blur-xl border-2 transition-all hover:scale-105 ${
                  profile.darkMode 
                    ? 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/30' 
                    : 'bg-black/5 border-black/20 text-black hover:bg-black/10 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/30'
                }`}
              >
                <Download className="w-5 h-5 mx-auto" />
              </button>
              
              <label className={`flex-1 p-4 rounded-2xl backdrop-blur-xl border-2 transition-all hover:scale-105 cursor-pointer ${
                profile.darkMode 
                  ? 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/30' 
                  : 'bg-black/5 border-black/20 text-black hover:bg-black/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/30'
              }`}>
                <Upload className="w-5 h-5 mx-auto" />
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* Admin Login Modal */}
        {showAdminLogin && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className={`w-full max-w-sm rounded-3xl p-8 backdrop-blur-2xl border-2 shadow-2xl transform transition-all ${
              profile.darkMode 
                ? 'bg-gray-900/90 border-purple-500/30 shadow-purple-500/20' 
                : 'bg-white/90 border-purple-500/30 shadow-purple-500/20'
            }`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}>
                  🔐 Admin Login
                </h3>
                <button
                  onClick={() => setShowAdminLogin(false)}
                  className={`p-2 rounded-xl transition-all hover:scale-110 ${
                    profile.darkMode 
                      ? 'hover:bg-white/10 text-gray-400' 
                      : 'hover:bg-black/10 text-gray-600'
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                  className={`w-full p-4 rounded-2xl backdrop-blur-xl border-2 transition-all focus:scale-[1.02] ${
                    profile.darkMode 
                      ? 'bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500/50' 
                      : 'bg-black/5 border-black/20 text-black placeholder:text-gray-400 focus:border-purple-500/50'
                  }`}
                />
                <button
                  onClick={handleAdminLogin}
                  className="w-full p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/50"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Link Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className={`w-full max-w-sm rounded-3xl p-8 backdrop-blur-2xl border-2 shadow-2xl ${
              profile.darkMode 
                ? 'bg-gray-900/90 border-green-500/30 shadow-green-500/20' 
                : 'bg-white/90 border-green-500/30 shadow-green-500/20'
            }`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  ➕ Add New Link
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className={`p-2 rounded-xl transition-all hover:scale-110 ${
                    profile.darkMode 
                      ? 'hover:bg-white/10 text-gray-400' 
                      : 'hover:bg-black/10 text-gray-600'
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Link title"
                  value={newLink.title || ''}
                  onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full p-4 rounded-2xl backdrop-blur-xl border-2 transition-all focus:scale-[1.02] ${
                    profile.darkMode 
                      ? 'bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-green-500/50' 
                      : 'bg-black/5 border-black/20 text-black placeholder:text-gray-400 focus:border-green-500/50'
                  }`}
                />
                <input
                  type="url"
                  placeholder="Link URL"
                  value={newLink.url || ''}
                  onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                  className={`w-full p-4 rounded-2xl backdrop-blur-xl border-2 transition-all focus:scale-[1.02] ${
                    profile.darkMode 
                      ? 'bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-green-500/50' 
                      : 'bg-black/5 border-black/20 text-black placeholder:text-gray-400 focus:border-green-500/50'
                  }`}
                />
                <select
                  value={newLink.iconUrl || ''}
                  onChange={(e) => setNewLink(prev => ({ ...prev, iconUrl: e.target.value }))}
                  className={`w-full p-4 rounded-2xl backdrop-blur-xl border-2 transition-all ${
                    profile.darkMode 
                      ? 'bg-gray-800 border-white/20 text-white' 
                      : 'bg-white border-black/20 text-black'
                  }`}
                >
                  <option value="">Select Icon</option>
                  <option value="globe">🌐 Website</option>
                  <option value="telegram">📱 Telegram</option>
                  <option value="github">💻 GitHub</option>
                  <option value="youtube">📺 YouTube</option>
                  <option value="instagram">📷 Instagram</option>
                  <option value="twitter">🐦 Twitter</option>
                  <option value="linkedin">💼 LinkedIn</option>
                  <option value="music">🎵 Music</option>
                  <option value="mail">📧 Email</option>
                </select>
                <input
                  type="url"
                  placeholder="Custom Icon URL (optional)"
                  value={newLink.iconUrl?.startsWith('http') ? newLink.iconUrl : ''}
                  onChange={(e) => setNewLink(prev => ({ ...prev, iconUrl: e.target.value }))}
                  className={`w-full p-4 rounded-2xl backdrop-blur-xl border-2 transition-all focus:scale-[1.02] ${
                    profile.darkMode 
                      ? 'bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-green-500/50' 
                      : 'bg-black/5 border-black/20 text-black placeholder:text-gray-400 focus:border-green-500/50'
                  }`}
                />
                <select
                  value={newLink.color || 'purple'}
                  onChange={(e) => setNewLink(prev => ({ ...prev, color: e.target.value }))}
                  className={`w-full p-4 rounded-2xl backdrop-blur-xl border-2 transition-all ${
                    profile.darkMode 
                      ? 'bg-gray-800 border-white/20 text-white' 
                      : 'bg-white border-black/20 text-black'
                  }`}
                >
                  <option value="purple">💜 Purple</option>
                  <option value="blue">💙 Blue</option>
                  <option value="red">❤️ Red</option>
                  <option value="pink">💗 Pink</option>
                  <option value="gray">🩶 Gray</option>
                  <option value="green">💚 Green</option>
                </select>
                <button
                  onClick={addLink}
                  className="w-full p-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/50"
                >
                  Add Link
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Link Modal */}
        {editingLink && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className={`w-full max-w-sm rounded-3xl p-8 backdrop-blur-2xl border-2 shadow-2xl ${
              profile.darkMode 
                ? 'bg-gray-900/90 border-blue-500/30 shadow-blue-500/20' 
                : 'bg-white/90 border-blue-500/30 shadow-blue-500/20'
            }`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  ✏️ Edit Link
                </h3>
                <button
                  onClick={() => setEditingLink(null)}
                  className={`p-2 rounded-xl transition-all hover:scale-110 ${
                    profile.darkMode 
                      ? 'hover:bg-white/10 text-gray-400' 
                      : 'hover:bg-black/10 text-gray-600'
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Link title"
                  value={editingLink.title}
                  onChange={(e) => setEditingLink(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className={`w-full p-4 rounded-2xl backdrop-blur-xl border-2 transition-all focus:scale-[1.02] ${
                    profile.darkMode 
                      ? 'bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-blue-500/50' 
                      : 'bg-black/5 border-black/20 text-black placeholder:text-gray-400 focus:border-blue-500/50'
                  }`}
                />
                <input
                  type="url"
                  placeholder="Link URL"
                  value={editingLink.url}
                  onChange={(e) => setEditingLink(prev => prev ? { ...prev, url: e.target.value } : null)}
                  className={`w-full p-4 rounded-2xl backdrop-blur-xl border-2 transition-all focus:scale-[1.02] ${
                    profile.darkMode 
                      ? 'bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-blue-500/50' 
                      : 'bg-black/5 border-black/20 text-black placeholder:text-gray-400 focus:border-blue-500/50'
                  }`}
                />
                <select
                  value={editingLink.iconUrl && !editingLink.iconUrl.startsWith('http') ? editingLink.iconUrl : ''}
                  onChange={(e) => setEditingLink(prev => prev ? { ...prev, iconUrl: e.target.value } : null)}
                  className={`w-full p-4 rounded-2xl backdrop-blur-xl border-2 transition-all ${
                    profile.darkMode 
                      ? 'bg-gray-800 border-white/20 text-white' 
                      : 'bg-white border-black/20 text-black'
                  }`}
                >
                  <option value="">Select Icon</option>
                  <option value="globe">🌐 Website</option>
                  <option value="telegram">📱 Telegram</option>
                  <option value="github">💻 GitHub</option>
                  <option value="youtube">📺 YouTube</option>
                  <option value="instagram">📷 Instagram</option>
                  <option value="twitter">🐦 Twitter</option>
                  <option value="linkedin">💼 LinkedIn</option>
                  <option value="music">🎵 Music</option>
                  <option value="mail">📧 Email</option>
                </select>
                <input
                  type="url"
                  placeholder="Custom Icon URL (optional)"
                  value={editingLink.iconUrl?.startsWith('http') ? editingLink.iconUrl : ''}
                  onChange={(e) => setEditingLink(prev => prev ? { ...prev, iconUrl: e.target.value } : null)}
                  className={`w-full p-4 rounded-2xl backdrop-blur-xl border-2 transition-all focus:scale-[1.02] ${
                    profile.darkMode 
                      ? 'bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-blue-500/50' 
                      : 'bg-black/5 border-black/20 text-black placeholder:text-gray-400 focus:border-blue-500/50'
                  }`}
                />
                <select
                  value={editingLink.color || 'purple'}
                  onChange={(e) => setEditingLink(prev => prev ? { ...prev, color: e.target.value } : null)}
                  className={`w-full p-4 rounded-2xl backdrop-blur-xl border-2 transition-all ${
                    profile.darkMode 
                      ? 'bg-gray-800 border-white/20 text-white' 
                      : 'bg-white border-black/20 text-black'
                  }`}
                >
                  <option value="purple">💜 Purple</option>
                  <option value="blue">💙 Blue</option>
                  <option value="red">❤️ Red</option>
                  <option value="pink">💗 Pink</option>
                  <option value="gray">🩶 Gray</option>
                  <option value="green">💚 Green</option>
                </select>
                <button
                  onClick={updateLink}
                  className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/50"
                >
                  Update Link
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-10">
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-xl border-2 transition-all hover:scale-105 ${
            profile.darkMode 
              ? 'bg-white/5 border-white/10 text-gray-400 hover:border-purple-500/30' 
              : 'bg-black/5 border-black/10 text-gray-500 hover:border-purple-500/30'
          }`}>
            <span className="text-sm">Built with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="text-sm">using React</span>
          </div>
        </div>
      </div>

      {/* Custom animation styles */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdvancedBioLink;
