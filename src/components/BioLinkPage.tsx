import { 
  Globe, 
  Send, 
  Github, 
  Youtube, 
  Instagram,
  ExternalLink 
} from 'lucide-react';
import profileAvatar from '@/assets/profile-avatar.jpg';

interface LinkButtonProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  href: string;
  color?: string;
}

const LinkButton = ({ icon, title, subtitle, href, color = 'default' }: LinkButtonProps) => {
  const handleClick = () => {
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      onClick={handleClick}
      className="bio-link-btn group w-full flex items-center gap-4 text-left"
    >
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
        color === 'telegram' ? 'bg-blue-500/20 text-blue-400' :
        color === 'github' ? 'bg-gray-500/20 text-gray-300' :
        color === 'youtube' ? 'bg-red-500/20 text-red-400' :
        color === 'instagram' ? 'bg-pink-500/20 text-pink-400' :
        'bg-primary/20 text-primary'
      }`}>
        {icon}
      </div>
      
      <div className="flex-grow min-w-0">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
            {subtitle}
          </p>
        )}
      </div>
      
      <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
    </div>
  );
};

const BioLinkPage = () => {
  const links = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Personal Website",
      subtitle: "Visit my portfolio and blog",
      href: "https://example.com",
      color: "default" as const
    },
    {
      icon: <Send className="w-6 h-6" />,
      title: "Telegram Channel",
      subtitle: "Latest updates and content",
      href: "https://t.me/username",
      color: "telegram" as const
    },
    {
      icon: <Github className="w-6 h-6" />,
      title: "GitHub Profile",
      subtitle: "Open source projects and code",
      href: "https://github.com/username",
      color: "github" as const
    },
    {
      icon: <Youtube className="w-6 h-6" />,
      title: "YouTube Channel",
      subtitle: "Tech tutorials and content",
      href: "https://youtube.com/@username",
      color: "youtube" as const
    },
    {
      icon: <Instagram className="w-6 h-6" />,
      title: "Instagram",
      subtitle: "Behind the scenes content",
      href: "https://instagram.com/username",
      color: "instagram" as const
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Profile Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <img
              src={profileAvatar}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover profile-glow pulse-glow"
            />
          </div>
          
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Your Name
          </h1>
          
          <p className="text-lg text-muted-foreground mb-1">
            @username
          </p>
          
          <p className="text-foreground/80 leading-relaxed">
            Creator • Developer • Content Maker<br />
            Building amazing things on the internet ✨
          </p>
        </div>

        {/* Links Section */}
        <div className="space-y-4 mb-8">
          {links.map((link, index) => (
            <div 
              key={index}
              className="float"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <LinkButton {...link} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="glass-card px-4 py-3 inline-block">
            <p className="text-sm text-muted-foreground">
              Built with ❤️ using React
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioLinkPage;