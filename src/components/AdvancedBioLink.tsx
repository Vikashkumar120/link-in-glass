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
  Heart,
  Link,
  Loader2
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '@/integrations/supabase/client';
import bioBgVideo from '@/assets/bio-bg-video.mp4';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  iconUrl?: string;
  color?: string;
  sortOrder?: number;
}

interface ProfileData {
  username: string;
  tagline: string;
  profileImage: string;
  links: LinkItem[];
  darkMode: boolean;
}

const ADMIN_PASSWORD = "vikas123";

// Animated background particles
const FloatingParticles = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {[...Array(30)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full animate-float-particle"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${4 + Math.random() * 8}px`,
          height: `${4 + Math.random() * 8}px`,
          background: `radial-gradient(circle, rgba(139, 92, 246, ${0.1 + Math.random() * 0.3}) 0%, transparent 70%)`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${8 + Math.random() * 10}s`,
        }}
      />
    ))}
  </div>
);

// Icon renderer with better styling
const IconRenderer = ({ iconUrl, color }: { iconUrl?: string; color?: string }) => {
  const iconClass = "w-6 h-6";
  const iconColors: Record<string, string> = {
    telegram: "text-[#0088cc]",
    github: "text-white",
    youtube: "text-[#FF0000]",
    instagram: "text-[#E4405F]",
    twitter: "text-[#1DA1F2]",
    linkedin: "text-[#0A66C2]",
    music: "text-[#1DB954]",
    mail: "text-[#EA4335]",
    globe: "text-purple-400",
    link: "text-cyan-400",
  };

  const iconBgs: Record<string, string> = {
    telegram: "from-[#0088cc]/30 to-[#0088cc]/10",
    github: "from-gray-600/30 to-gray-800/30",
    youtube: "from-[#FF0000]/30 to-[#FF0000]/10",
    instagram: "from-[#E4405F]/30 via-[#FD1D1D]/20 to-[#F77737]/30",
    twitter: "from-[#1DA1F2]/30 to-[#1DA1F2]/10",
    linkedin: "from-[#0A66C2]/30 to-[#0A66C2]/10",
    music: "from-[#1DB954]/30 to-[#1DB954]/10",
    mail: "from-[#EA4335]/30 to-[#EA4335]/10",
    globe: "from-purple-500/30 to-purple-700/30",
    link: "from-cyan-500/30 to-cyan-700/30",
  };

  if (!iconUrl) {
    return (
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500/30 to-purple-700/30 backdrop-blur-sm border border-white/10 shadow-lg">
        <Link className={`${iconClass} text-purple-400`} />
      </div>
    );
  }

  if (iconUrl.startsWith('http') || iconUrl.startsWith('/')) {
    return (
      <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/20 shadow-lg">
        <img src={iconUrl} alt="" className="w-full h-full object-cover" />
      </div>
    );
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
    link: <Link className={`${iconClass} ${iconColors.link}`} />,
  };

  return (
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${iconBgs[iconUrl] || iconBgs.globe} backdrop-blur-sm border border-white/10 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
      {icons[iconUrl] || <Link className={`${iconClass} text-purple-400`} />}
    </div>
  );
};

const AdvancedBioLink: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    username: "Loading...",
    tagline: "",
    profileImage: "",
    links: [],
    darkMode: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLink, setNewLink] = useState<Partial<LinkItem>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Load data from database
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from('biolink_profiles')
        .select('*')
        .eq('profile_id', 'default')
        .maybeSingle();

      // Load links
      const { data: linksData, error: linksError } = await supabase
        .from('biolink_links')
        .select('*')
        .eq('profile_id', 'default')
        .order('sort_order', { ascending: true });

      if (profileData) {
        setProfile({
          username: profileData.username,
          tagline: profileData.tagline || '',
          profileImage: profileData.profile_image || '/lovable-uploads/4d946d6d-2c54-41f2-850c-b9d435bbf7a7.png',
          darkMode: profileData.dark_mode ?? true,
          links: (linksData || []).map(link => ({
            id: link.id,
            title: link.title,
            url: link.url,
            iconUrl: link.icon_url || undefined,
            color: link.color || 'purple',
            sortOrder: link.sort_order
          }))
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async (updatedProfile: Partial<ProfileData>) => {
    setIsSaving(true);
    try {
      await supabase
        .from('biolink_profiles')
        .update({
          username: updatedProfile.username ?? profile.username,
          tagline: updatedProfile.tagline ?? profile.tagline,
          profile_image: updatedProfile.profileImage ?? profile.profileImage,
          dark_mode: updatedProfile.darkMode ?? profile.darkMode,
          updated_at: new Date().toISOString()
        })
        .eq('profile_id', 'default');
      
      setProfile(prev => ({ ...prev, ...updatedProfile }));
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

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

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    const items = Array.from(profile.links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setProfile(prev => ({ ...prev, links: items }));

    // Update sort order in database
    for (let i = 0; i < items.length; i++) {
      await supabase
        .from('biolink_links')
        .update({ sort_order: i })
        .eq('id', items[i].id);
    }
  };

  const addLink = async () => {
    if (!newLink.title || !newLink.url) return;
    setIsSaving(true);

    try {
      const { data, error } = await supabase
        .from('biolink_links')
        .insert({
          profile_id: 'default',
          title: newLink.title,
          url: newLink.url,
          icon_url: newLink.iconUrl || 'link',
          color: newLink.color || 'purple',
          sort_order: profile.links.length
        })
        .select()
        .single();

      if (data) {
        setProfile(prev => ({
          ...prev,
          links: [...prev.links, {
            id: data.id,
            title: data.title,
            url: data.url,
            iconUrl: data.icon_url || undefined,
            color: data.color || 'purple'
          }]
        }));
      }
      setNewLink({});
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding link:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateLink = async () => {
    if (!editingLink || !editingLink.title || !editingLink.url) return;
    setIsSaving(true);

    try {
      await supabase
        .from('biolink_links')
        .update({
          title: editingLink.title,
          url: editingLink.url,
          icon_url: editingLink.iconUrl || 'link',
          color: editingLink.color || 'purple'
        })
        .eq('id', editingLink.id);

      setProfile(prev => ({
        ...prev,
        links: prev.links.map(link => link.id === editingLink.id ? editingLink : link)
      }));
      setEditingLink(null);
    } catch (error) {
      console.error('Error updating link:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteLink = async (id: string) => {
    try {
      await supabase.from('biolink_links').delete().eq('id', id);
      setProfile(prev => ({
        ...prev,
        links: prev.links.filter(link => link.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    try {
      const fileName = `profile-${Date.now()}.${file.name.split('.').pop()}`;
      const { data, error } = await supabase.storage
        .from('biolink-images')
        .upload(fileName, file, { upsert: true });

      if (data) {
        const { data: { publicUrl } } = supabase.storage
          .from('biolink-images')
          .getPublicUrl(fileName);

        await saveProfile({ profileImage: publicUrl });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsSaving(false);
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

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        await saveProfile(importedData);
        // Reload to get fresh data
        loadProfileData();
      } catch (error) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const toggleDarkMode = () => {
    const newMode = !profile.darkMode;
    setProfile(prev => ({ ...prev, darkMode: newMode }));
    saveProfile({ darkMode: newMode });
  };

  const getButtonGradient = (color: string) => {
    const gradients: Record<string, string> = {
      purple: 'from-purple-600/20 via-violet-500/15 to-fuchsia-600/20',
      blue: 'from-blue-600/20 via-cyan-500/15 to-sky-600/20',
      red: 'from-red-600/20 via-rose-500/15 to-pink-600/20',
      pink: 'from-pink-600/20 via-fuchsia-500/15 to-rose-600/20',
      gray: 'from-gray-600/20 via-slate-500/15 to-zinc-600/20',
      green: 'from-emerald-600/20 via-green-500/15 to-teal-600/20'
    };
    return gradients[color] || gradients.purple;
  };

  const getGlowColor = (color: string) => {
    const glows: Record<string, string> = {
      purple: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]',
      blue: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]',
      red: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]',
      pink: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]',
      gray: 'hover:shadow-[0_0_30px_rgba(156,163,175,0.4)]',
      green: 'hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]'
    };
    return glows[color] || glows.purple;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900/40 via-gray-900 to-black">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative transition-all duration-700 ${
      profile.darkMode 
        ? 'bg-black' 
        : 'bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-purple-50 via-white to-blue-50'
    }`}>
      {/* Background Video */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ opacity: profile.darkMode ? 0.5 : 0.2 }}
        >
          <source src={bioBgVideo} type="video/mp4" />
        </video>
        <div className={`absolute inset-0 ${
          profile.darkMode 
            ? 'bg-gradient-to-b from-black/40 via-transparent to-black/60' 
            : 'bg-gradient-to-b from-white/60 via-white/30 to-white/60'
        }`} />
      </div>

      <FloatingParticles />
      
      <div className="container mx-auto px-4 py-8 max-w-md relative z-10">
        
        {/* Header Controls */}
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-2xl backdrop-blur-xl border-2 transition-all duration-500 hover:scale-110 hover:rotate-12 ${
              profile.darkMode 
                ? 'bg-white/5 border-white/20 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-500/50 hover:shadow-[0_0_25px_rgba(234,179,8,0.4)]' 
                : 'bg-black/5 border-black/20 text-indigo-600 hover:bg-indigo-500/20 hover:border-indigo-500/50 hover:shadow-[0_0_25px_rgba(99,102,241,0.4)]'
            }`}
          >
            {profile.darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => isAdminMode ? handleLogout() : setShowAdminLogin(true)}
            className={`p-3 rounded-2xl backdrop-blur-xl border-2 transition-all duration-500 hover:scale-110 ${
              isAdminMode
                ? 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30 hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] animate-pulse'
                : profile.darkMode 
                  ? 'bg-white/5 border-white/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:rotate-90' 
                  : 'bg-black/5 border-black/20 text-purple-600 hover:bg-purple-500/20 hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:rotate-90'
            }`}
          >
            {isAdminMode ? <EyeOff className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
          </button>
        </div>

        {/* Profile Section */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="relative inline-block mb-6">
            {/* Outer animated rings */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 animate-spin-slow opacity-60 blur-md" />
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-reverse-spin opacity-40 blur-sm" />
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 opacity-70" />
            
            <div className="relative">
              <img
                src={profile.profileImage || '/lovable-uploads/4d946d6d-2c54-41f2-850c-b9d435bbf7a7.png'}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-white/30 shadow-2xl relative z-10 transition-transform duration-500 hover:scale-105"
              />
              {isAdminMode && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full cursor-pointer transition-all hover:bg-black/70 z-20">
                  {isSaving ? <Loader2 className="w-8 h-8 text-white animate-spin" /> : <Upload className="w-8 h-8 text-white" />}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isSaving}
                  />
                </label>
              )}
            </div>
            
            {/* Sparkle effects */}
            <Sparkles className="absolute -top-1 -right-1 w-7 h-7 text-yellow-400 animate-bounce z-20" />
            <Sparkles className="absolute -bottom-1 -left-1 w-5 h-5 text-cyan-400 animate-bounce z-20" style={{ animationDelay: '0.5s' }} />
          </div>
          
          {isAdminMode ? (
            <div className="space-y-3">
              <input
                type="text"
                value={profile.username}
                onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                onBlur={() => saveProfile({ username: profile.username })}
                className={`text-4xl font-extrabold text-center w-full bg-transparent border-b-2 border-dashed focus:outline-none focus:border-purple-500 transition-colors ${
                  profile.darkMode ? 'text-white border-white/30' : 'text-black border-black/30'
                }`}
              />
              <textarea
                value={profile.tagline}
                onChange={(e) => setProfile(prev => ({ ...prev, tagline: e.target.value }))}
                onBlur={() => saveProfile({ tagline: profile.tagline })}
                className={`text-center w-full bg-transparent border-b-2 border-dashed focus:outline-none focus:border-purple-500 transition-colors resize-none text-lg ${
                  profile.darkMode ? 'text-gray-300 border-white/30' : 'text-gray-600 border-black/30'
                }`}
              />
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
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
                        className={`group relative backdrop-blur-2xl rounded-2xl p-5 border-2 transition-all duration-500 cursor-pointer animate-slide-up
                          ${snapshot.isDragging ? 'rotate-3 scale-105 z-50' : 'hover:scale-[1.03] hover:-translate-y-1'}
                          bg-gradient-to-r ${getButtonGradient(link.color || 'purple')}
                          border-white/10 hover:border-white/30
                          shadow-xl ${getGlowColor(link.color || 'purple')}
                          ${profile.darkMode ? '' : 'bg-white/60'}
                        `}
                        style={{ animationDelay: `${index * 0.1}s`, ...provided.draggableProps.style }}
                        onClick={() => !isAdminMode && window.open(link.url, '_blank')}
                      >
                        {/* Animated shine effect */}
                        <div className="absolute inset-0 rounded-2xl overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                        </div>
                        
                        {/* Glow border effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-cyan-500/0 group-hover:from-purple-500/20 group-hover:via-pink-500/20 group-hover:to-cyan-500/20 transition-all duration-500" />
                        
                        <div className="flex items-center relative z-10">
                          {isAdminMode && (
                            <div {...provided.dragHandleProps} className="mr-3 cursor-grab active:cursor-grabbing">
                              <GripVertical className={`w-5 h-5 ${profile.darkMode ? 'text-gray-500' : 'text-gray-400'} transition-colors group-hover:text-purple-400`} />
                            </div>
                          )}
                          
                          <div className="mr-4 flex-shrink-0">
                            <IconRenderer iconUrl={link.iconUrl} color={link.color} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-bold text-lg truncate ${profile.darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {link.title}
                            </h3>
                          </div>

                          {isAdminMode ? (
                            <div className="flex space-x-2 ml-2" onClick={(e) => e.stopPropagation()}>
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
                            <ExternalLink className={`w-5 h-5 ml-2 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${
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
              className="w-full p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-r from-emerald-500/30 via-green-500/20 to-teal-500/30 border-2 border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center text-white font-bold group"
            >
              <Plus className="w-6 h-6 mr-2 transition-transform group-hover:rotate-90" />
              Add New Link
            </button>

            <div className="flex space-x-3">
              <button
                onClick={exportData}
                className={`flex-1 p-4 rounded-2xl backdrop-blur-xl border-2 transition-all duration-300 hover:scale-105 ${
                  profile.darkMode 
                    ? 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                    : 'bg-black/5 border-black/20 text-black hover:bg-black/10 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                }`}
              >
                <Download className="w-5 h-5 mx-auto" />
              </button>
              
              <label className={`flex-1 p-4 rounded-2xl backdrop-blur-xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${
                profile.darkMode 
                  ? 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
                  : 'bg-black/5 border-black/20 text-black hover:bg-black/10 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]'
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className={`w-full max-w-sm rounded-3xl p-8 backdrop-blur-2xl border-2 shadow-2xl transform animate-scale-in ${
              profile.darkMode 
                ? 'bg-gray-900/95 border-purple-500/30 shadow-purple-500/20' 
                : 'bg-white/95 border-purple-500/30 shadow-purple-500/20'
            }`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  🔐 Admin Login
                </h3>
                <button
                  onClick={() => setShowAdminLogin(false)}
                  className={`p-2 rounded-xl transition-all hover:scale-110 hover:rotate-90 ${
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
                      ? 'bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:shadow-[0_0_20px_rgba(168,85,247,0.2)]' 
                      : 'bg-black/5 border-black/20 text-black placeholder:text-gray-400 focus:border-purple-500/50 focus:shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                  }`}
                />
                <button
                  onClick={handleAdminLogin}
                  className="w-full p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-95"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Link Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className={`w-full max-w-sm rounded-3xl p-8 backdrop-blur-2xl border-2 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto ${
              profile.darkMode 
                ? 'bg-gray-900/95 border-green-500/30 shadow-green-500/20' 
                : 'bg-white/95 border-green-500/30 shadow-green-500/20'
            }`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  ➕ Add New Link
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className={`p-2 rounded-xl transition-all hover:scale-110 hover:rotate-90 ${
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
                  <option value="link">🔗 Link</option>
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
                  disabled={isSaving}
                  className="w-full p-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : 'Add Link'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Link Modal */}
        {editingLink && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className={`w-full max-w-sm rounded-3xl p-8 backdrop-blur-2xl border-2 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto ${
              profile.darkMode 
                ? 'bg-gray-900/95 border-blue-500/30 shadow-blue-500/20' 
                : 'bg-white/95 border-blue-500/30 shadow-blue-500/20'
            }`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  ✏️ Edit Link
                </h3>
                <button
                  onClick={() => setEditingLink(null)}
                  className={`p-2 rounded-xl transition-all hover:scale-110 hover:rotate-90 ${
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
                  <option value="link">🔗 Link</option>
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
                  disabled={isSaving}
                  className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : 'Update Link'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-10">
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-xl border-2 transition-all duration-300 hover:scale-105 ${
            profile.darkMode 
              ? 'bg-white/5 border-white/10 text-gray-400 hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]' 
              : 'bg-black/5 border-black/10 text-gray-500 hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]'
          }`}>
            <span className="text-sm">Built with</span>
            <Heart className="w-4 h-4 text-red-500 animate-heartbeat" />
            <span className="text-sm">by CodeNinjaVik</span>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-reverse-spin {
          animation: reverse-spin 8s linear infinite;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
          opacity: 0;
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
          50% { transform: translateY(-40px) translateX(-10px); opacity: 0.3; }
          75% { transform: translateY(-20px) translateX(5px); opacity: 0.5; }
        }
        .animate-float-particle {
          animation: float-particle 10s ease-in-out infinite;
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .animate-heartbeat {
          animation: heartbeat 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AdvancedBioLink;
