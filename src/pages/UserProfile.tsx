import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  Moon, Sun, ExternalLink, Loader2, Home,
  Send, Github, Youtube, Instagram, Twitter, 
  Linkedin, Music, Mail, Globe, Link as LinkIcon, Heart
} from 'lucide-react';

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

const FloatingParticles = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
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

  if (!iconUrl) {
    return (
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500/30 to-purple-700/30 backdrop-blur-sm border border-white/10 shadow-lg">
        <LinkIcon className={`${iconClass} text-purple-400`} />
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
    link: <LinkIcon className={`${iconClass} ${iconColors.link}`} />,
  };

  return (
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${iconBgs[iconUrl] || iconBgs.globe} backdrop-blur-sm border border-white/10 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
      {icons[iconUrl] || <LinkIcon className={`${iconClass} text-purple-400`} />}
    </div>
  );
};

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [localDarkMode, setLocalDarkMode] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    if (!username) return;

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('biolink_profiles')
        .select('*')
        .eq('username', username.toLowerCase())
        .maybeSingle();

      if (!profileData) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

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
        links: (linksData || []).map(link => ({
          id: link.id,
          title: link.title,
          url: link.url,
          iconUrl: link.icon_url || undefined,
          color: link.color || 'purple'
        }))
      });
      setLocalDarkMode(profileData.dark_mode ?? true);
    } catch (error) {
      console.error('Error loading profile:', error);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
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
          <p className="text-gray-400 animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900/40 via-gray-900 to-black">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-400 mb-6">The user @{username} doesn't exist.</p>
          <Link 
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative transition-all duration-700 ${
      localDarkMode 
        ? 'bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-900 via-purple-900/50 to-gray-900' 
        : 'bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-purple-50 via-white to-blue-50'
    }`}>
      <FloatingParticles />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-md relative z-10">
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() => setLocalDarkMode(!localDarkMode)}
            className={`p-3 rounded-2xl backdrop-blur-xl border-2 transition-all duration-500 hover:scale-110 ${
              localDarkMode 
                ? 'bg-white/5 border-white/20 text-yellow-400 hover:bg-yellow-500/20' 
                : 'bg-black/5 border-black/20 text-indigo-600 hover:bg-indigo-500/20'
            }`}
          >
            {localDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <Link
            to="/auth"
            className={`px-4 py-2 rounded-xl backdrop-blur-xl border-2 transition-all duration-300 text-sm font-medium ${
              localDarkMode 
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30' 
                : 'bg-purple-500/20 border-purple-500/50 text-purple-600 hover:bg-purple-500/30'
            }`}
          >
            Create Your Own
          </Link>
        </div>

        {/* Profile Section */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 animate-spin-slow opacity-60 blur-md" />
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 opacity-70" />
            <img
              src={profile?.profileImage}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border-4 border-white/30 shadow-2xl relative z-10"
            />
          </div>
          
          <h1 className={`text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r ${
            localDarkMode 
              ? 'from-white via-purple-200 to-white' 
              : 'from-gray-800 via-purple-700 to-gray-800'
          }`}>
            @{profile?.username}
          </h1>
          
          <p className={`text-lg ${localDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {profile?.tagline}
          </p>
        </div>

        {/* Links */}
        <div className="space-y-4 mb-10">
          {profile?.links.map((link, index) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative block w-full p-4 rounded-2xl backdrop-blur-xl border-2 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 animate-slide-up ${
                localDarkMode
                  ? `bg-gradient-to-r ${getButtonGradient(link.color || 'purple')} border-white/20 hover:border-white/40`
                  : `bg-gradient-to-r ${getButtonGradient(link.color || 'purple')} border-gray-200 hover:border-purple-300`
              } ${getGlowColor(link.color || 'purple')}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                <IconRenderer iconUrl={link.iconUrl} />
                <span className={`flex-1 font-semibold text-lg ${localDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {link.title}
                </span>
                <ExternalLink className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${
                  localDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center pt-6">
          <p className={`text-sm flex items-center justify-center gap-1 ${localDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Made with <Heart className="w-4 h-4 text-red-500 animate-heartbeat" /> using CNBio
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
