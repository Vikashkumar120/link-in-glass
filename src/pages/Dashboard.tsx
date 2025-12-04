import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, Edit3, Trash2, Upload, Download, Moon, Sun, GripVertical,
  X, LogOut, Loader2, ExternalLink, Copy, Check, Share2, Lock, Unlock,
  Send, Github, Youtube, Instagram, Twitter, Linkedin, Music, Mail, Globe, Link as LinkIcon, Heart
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

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
  sharesCount: number;
  linksUnlocked: boolean;
}

const FREE_LINK_LIMIT = 2;
const SHARES_TO_UNLOCK = 2;

const IconRenderer = ({ iconUrl }: { iconUrl?: string }) => {
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

  if (!iconUrl || iconUrl.startsWith('http') || iconUrl.startsWith('/')) {
    if (iconUrl?.startsWith('http') || iconUrl?.startsWith('/')) {
      return (
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/20">
          <img src={iconUrl} alt="" className="w-full h-full object-cover" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-500/30 to-purple-700/30 border border-white/10">
        <LinkIcon className={`${iconClass} text-purple-400`} />
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
    link: <LinkIcon className={`${iconClass} ${iconColors.link}`} />,
  };

  return (
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${iconBgs[iconUrl] || iconBgs.globe} border border-white/10`}>
      {icons[iconUrl] || <LinkIcon className={`${iconClass} text-purple-400`} />}
    </div>
  );
};

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLink, setNewLink] = useState<Partial<LinkItem>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadProfile(session.user.id);
      } else {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadProfile = async (userId: string) => {
    try {
      const { data: profileData } = await supabase
        .from('biolink_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileData) {
        const { data: linksData } = await supabase
          .from('biolink_links')
          .select('*')
          .eq('profile_id', profileData.profile_id)
          .order('sort_order', { ascending: true });

        setProfile({
          username: profileData.username,
          tagline: profileData.tagline || '',
          profileImage: profileData.profile_image || '/lovable-uploads/4d946d6d-2c54-41f2-850c-b9d435bbf7a7.png',
          darkMode: profileData.dark_mode ?? true,
          sharesCount: profileData.shares_count || 0,
          linksUnlocked: profileData.links_unlocked || false,
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

  const saveProfile = async (updates: Partial<ProfileData>) => {
    if (!user) return;
    setIsSaving(true);
    try {
      await supabase
        .from('biolink_profiles')
        .update({
          username: updates.username ?? profile?.username,
          tagline: updates.tagline ?? profile?.tagline,
          profile_image: updates.profileImage ?? profile?.profileImage,
          dark_mode: updates.darkMode ?? profile?.darkMode,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast({ title: "Saved!", description: "Profile updated successfully." });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({ title: "Error", description: "Failed to save changes.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !profile) return;
    const items = Array.from(profile.links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setProfile(prev => prev ? { ...prev, links: items } : null);

    for (let i = 0; i < items.length; i++) {
      await supabase
        .from('biolink_links')
        .update({ sort_order: i })
        .eq('id', items[i].id);
    }
  };

  const canAddMoreLinks = () => {
    if (!profile) return false;
    if (profile.linksUnlocked) return true;
    return profile.links.length < FREE_LINK_LIMIT;
  };

  const addLink = async () => {
    if (!newLink.title || !newLink.url || !user) return;
    
    if (!canAddMoreLinks()) {
      toast({ 
        title: "Link limit reached!", 
        description: "Share with 2 friends on WhatsApp to unlock unlimited links.", 
        variant: "destructive" 
      });
      return;
    }
    
    setIsSaving(true);

    try {
      const { data, error } = await supabase
        .from('biolink_links')
        .insert({
          user_id: user.id,
          profile_id: user.id,
          title: newLink.title,
          url: newLink.url,
          icon_url: newLink.iconUrl || 'link',
          color: newLink.color || 'purple',
          sort_order: profile?.links.length || 0
        })
        .select()
        .single();

      if (data && profile) {
        setProfile(prev => prev ? {
          ...prev,
          links: [...prev.links, {
            id: data.id,
            title: data.title,
            url: data.url,
            iconUrl: data.icon_url || undefined,
            color: data.color || 'purple'
          }]
        } : null);
        toast({ title: "Link added!" });
      }
      setNewLink({});
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding link:', error);
      toast({ title: "Error", description: "Failed to add link.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleWhatsAppShare = async () => {
    if (!user || !profile) return;
    
    const shareUrl = `${window.location.origin}/u/${profile.username}`;
    const message = encodeURIComponent(`Check out my CNBio page! ${shareUrl}`);
    const whatsappUrl = `https://wa.me/?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Increment share count
    const newSharesCount = (profile.sharesCount || 0) + 1;
    const shouldUnlock = newSharesCount >= SHARES_TO_UNLOCK;
    
    try {
      await supabase
        .from('biolink_profiles')
        .update({ 
          shares_count: newSharesCount,
          links_unlocked: shouldUnlock
        })
        .eq('user_id', user.id);
      
      setProfile(prev => prev ? { 
        ...prev, 
        sharesCount: newSharesCount,
        linksUnlocked: shouldUnlock
      } : null);
      
      if (shouldUnlock) {
        toast({ 
          title: "🎉 Unlocked!", 
          description: "You can now add unlimited links!" 
        });
      } else {
        toast({ 
          title: "Shared!", 
          description: `${SHARES_TO_UNLOCK - newSharesCount} more share(s) to unlock unlimited links.` 
        });
      }
    } catch (error) {
      console.error('Error updating share count:', error);
    }
  };

  const updateLink = async () => {
    if (!editingLink) return;
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

      setProfile(prev => prev ? {
        ...prev,
        links: prev.links.map(link => link.id === editingLink.id ? editingLink : link)
      } : null);
      setEditingLink(null);
      toast({ title: "Link updated!" });
    } catch (error) {
      console.error('Error updating link:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteLink = async (id: string) => {
    try {
      await supabase.from('biolink_links').delete().eq('id', id);
      setProfile(prev => prev ? {
        ...prev,
        links: prev.links.filter(link => link.id !== id)
      } : null);
      toast({ title: "Link deleted!" });
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsSaving(true);
    try {
      const fileName = `${user.id}-${Date.now()}.${file.name.split('.').pop()}`;
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const copyProfileUrl = () => {
    const url = `${window.location.origin}/u/${profile?.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast({ title: "Copied!", description: "Profile URL copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const iconOptions = ['link', 'telegram', 'github', 'youtube', 'instagram', 'twitter', 'linkedin', 'music', 'mail', 'globe'];
  const colorOptions = ['purple', 'blue', 'red', 'pink', 'gray', 'green'];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-gray-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CNBio Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <Link
              to={`/u/${profile?.username}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/20 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              View Profile
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Profile URL */}
        <div className="mb-8 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30">
          <p className="text-sm text-gray-400 mb-2">Your Profile URL</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-black/30 px-4 py-2 rounded-lg text-purple-300 overflow-x-auto">
              {window.location.origin}/u/{profile?.username}
            </code>
            <button
              onClick={copyProfileUrl}
              className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-all"
            >
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
          
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <img
                src={profile?.profileImage}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-purple-500"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-all">
                {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            <div className="flex-1 space-y-3">
              <Input
                value={profile?.username || ''}
                onChange={(e) => setProfile(prev => prev ? { ...prev, username: e.target.value } : null)}
                onBlur={() => profile && saveProfile({ username: profile.username })}
                placeholder="Username"
                className="bg-white/5 border-white/20"
              />
              <Input
                value={profile?.tagline || ''}
                onChange={(e) => setProfile(prev => prev ? { ...prev, tagline: e.target.value } : null)}
                onBlur={() => profile && saveProfile({ tagline: profile.tagline })}
                placeholder="Tagline"
                className="bg-white/5 border-white/20"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <span>Dark Mode (for viewers)</span>
            <button
              onClick={() => saveProfile({ darkMode: !profile?.darkMode })}
              className={`p-2 rounded-lg transition-all ${profile?.darkMode ? 'bg-purple-500' : 'bg-gray-600'}`}
            >
              {profile?.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Links</h2>
            <div className="flex items-center gap-2">
              {profile?.linksUnlocked ? (
                <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  <Unlock className="w-4 h-4" />
                  Unlimited
                </span>
              ) : (
                <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                  <Lock className="w-4 h-4" />
                  {profile?.links.length || 0}/{FREE_LINK_LIMIT}
                </span>
              )}
              <Button
                onClick={() => canAddMoreLinks() ? setShowAddForm(true) : null}
                disabled={!canAddMoreLinks()}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            </div>
          </div>

          {/* Unlock Banner */}
          {!profile?.linksUnlocked && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-green-400 mb-1">
                    Unlock Unlimited Links!
                  </p>
                  <p className="text-sm text-gray-400">
                    Share your profile with {SHARES_TO_UNLOCK - (profile?.sharesCount || 0)} more friend(s) on WhatsApp
                  </p>
                </div>
                <Button
                  onClick={handleWhatsAppShare}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share on WhatsApp
                </Button>
              </div>
              <div className="mt-3 h-2 bg-black/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${((profile?.sharesCount || 0) / SHARES_TO_UNLOCK) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Add/Edit Form */}
          {(showAddForm || editingLink) && (
            <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/20 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">{editingLink ? 'Edit Link' : 'Add New Link'}</h3>
                <button onClick={() => { setShowAddForm(false); setEditingLink(null); }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <Input
                  placeholder="Title"
                  value={editingLink?.title || newLink.title || ''}
                  onChange={(e) => editingLink 
                    ? setEditingLink({ ...editingLink, title: e.target.value })
                    : setNewLink({ ...newLink, title: e.target.value })
                  }
                  className="bg-white/5 border-white/20"
                />
                <Input
                  placeholder="URL"
                  value={editingLink?.url || newLink.url || ''}
                  onChange={(e) => editingLink
                    ? setEditingLink({ ...editingLink, url: e.target.value })
                    : setNewLink({ ...newLink, url: e.target.value })
                  }
                  className="bg-white/5 border-white/20"
                />
                <div>
                  <p className="text-sm text-gray-400 mb-2">Icon</p>
                  <div className="flex flex-wrap gap-2">
                    {iconOptions.map(icon => (
                      <button
                        key={icon}
                        onClick={() => editingLink
                          ? setEditingLink({ ...editingLink, iconUrl: icon })
                          : setNewLink({ ...newLink, iconUrl: icon })
                        }
                        className={`p-2 rounded-lg border transition-all ${
                          (editingLink?.iconUrl || newLink.iconUrl) === icon
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <IconRenderer iconUrl={icon} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Color</p>
                  <div className="flex gap-2">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        onClick={() => editingLink
                          ? setEditingLink({ ...editingLink, color })
                          : setNewLink({ ...newLink, color })
                        }
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          (editingLink?.color || newLink.color) === color
                            ? 'border-white scale-110'
                            : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color === 'gray' ? '#6b7280' : color }}
                      />
                    ))}
                  </div>
                </div>
                <Button
                  onClick={editingLink ? updateLink : addLink}
                  disabled={isSaving}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingLink ? 'Save Changes' : 'Add Link')}
                </Button>
              </div>
            </div>
          )}

          {/* Links List */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="links">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {profile?.links.map((link, index) => (
                    <Draggable key={link.id} draggableId={link.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all"
                        >
                          <div {...provided.dragHandleProps} className="text-gray-500 hover:text-white cursor-grab">
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <IconRenderer iconUrl={link.iconUrl} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{link.title}</p>
                            <p className="text-sm text-gray-400 truncate">{link.url}</p>
                          </div>
                          <button
                            onClick={() => setEditingLink(link)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-all"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteLink(link.id)}
                            className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {profile?.links.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <LinkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No links yet. Add your first link!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
