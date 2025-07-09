import { 
  Globe, 
  Send, 
  Github, 
  Youtube, 
  Instagram,
  ExternalLink 
} from 'lucide-react';
import gyaanrepoLogo from '@/assets/gyaanrepo-logo.jpg';

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
      <div className={`icon-container flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${
        color === 'telegram' ? 'bg-blue-500/15 text-blue-300' :
        color === 'github' ? 'bg-gray-500/15 text-gray-200' :
        color === 'youtube' ? 'bg-red-500/15 text-red-300' :
        color === 'instagram' ? 'bg-pink-500/15 text-pink-300' :
        'bg-primary/15 text-primary'
      }`}>
        {icon}
      </div>
      
      <div className="flex-grow min-w-0">
        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground/90 group-hover:text-foreground/70 transition-colors duration-300">
            {subtitle}
          </p>
        )}
      </div>
      
      <ExternalLink className="w-6 h-6 text-muted-foreground/60 group-hover:text-primary transition-all duration-300 flex-shrink-0 group-hover:translate-x-1" />
    </div>
  );
};

const BioLinkPage = () => {
  const links = [
    {
      icon: <img src={gyaanrepoLogo} alt="GyaanRepo" className="w-6 h-6 rounded-md" />,
      title: "GyaanRepo Website",
      subtitle: "Knowledge repository and resources",
      href: "https://gyaanrepo.netlify.app/",
      color: "default" as const
    },
    {
      icon: <Send className="w-6 h-6" />,
      title: "Telegram Channel",
      subtitle: "Latest updates and tech content",
      href: "https://t.me/gyaanRepo",
      color: "telegram" as const
    },
    {
      icon: <Github className="w-6 h-6" />,
      title: "GitHub Profile",
      subtitle: "Open source projects and code",
      href: "https://github.com/vikashkumar14",
      color: "github" as const
    },
    {
      icon: <Youtube className="w-6 h-6" />,
      title: "YouTube Channel",
      subtitle: "The Editor Star - Tech tutorials",
      href: "https://youtube.com/@theeditorstar12?si=FP4yAjH0T2a33833",
      color: "youtube" as const
    },
    {
      icon: <Instagram className="w-6 h-6" />,
      title: "Instagram",
      subtitle: "@codeninjavik - Behind the scenes",
      href: "https://instagram.com/codeninjavik",
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
              src="/lovable-uploads/4d946d6d-2c54-41f2-850c-b9d435bbf7a7.png"
              alt="CodeNinjaVik Profile"
              className="w-32 h-32 rounded-full object-cover profile-glow pulse-glow"
            />
          </div>
          
          <h1 className="text-3xl font-bold gradient-text mb-2">
            CodeNinjaVik
          </h1>
          
          <p className="text-lg text-muted-foreground mb-1">
            @codeninjavik
          </p>
          
          <p className="text-foreground/80 leading-relaxed">
            Developer • Content Creator • Tech Enthusiast<br />
            Building knowledge repositories & coding tutorials ⚡
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