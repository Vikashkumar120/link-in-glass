import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Users, Palette, Link as LinkIcon, Zap, Heart, Youtube, Github, Instagram, Send, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import codeNinjaLogo from '@/assets/codeninja-logo.jpg';
import bioBgVideo from '@/assets/bio-bg-video.mp4';

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

const Index = () => {
  const socialLinks = [
    { icon: <Youtube className="w-5 h-5" />, url: 'https://youtube.com/@codeninjavik', label: 'YouTube', color: 'hover:bg-red-500/20 hover:text-red-400' },
    { icon: <Github className="w-5 h-5" />, url: 'https://github.com/codeninjavik', label: 'GitHub', color: 'hover:bg-gray-500/20 hover:text-white' },
    { icon: <Instagram className="w-5 h-5" />, url: 'https://instagram.com/codeninjavik', label: 'Instagram', color: 'hover:bg-pink-500/20 hover:text-pink-400' },
    { icon: <Send className="w-5 h-5" />, url: 'https://t.me/codeninjavik', label: 'Telegram', color: 'hover:bg-blue-500/20 hover:text-blue-400' },
    { icon: <Twitter className="w-5 h-5" />, url: 'https://twitter.com/codeninjavik', label: 'Twitter', color: 'hover:bg-sky-500/20 hover:text-sky-400' },
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Video */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40"
        >
          <source src={bioBgVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
      </div>

      <FloatingParticles />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <header className="relative z-10 container mx-auto px-4 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={codeNinjaLogo} alt="CNBio" className="w-10 h-10 rounded-xl" />
          <span className="text-2xl font-bold text-white">CNBio</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/about" className="text-gray-300 hover:text-white transition-colors hidden sm:block">About</Link>
          <Link to="/contact" className="text-gray-300 hover:text-white transition-colors hidden sm:block">Contact</Link>
          <Link to="/auth">
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
              Sign In
            </Button>
          </Link>
          <Link to="/auth">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              Get Started
            </Button>
          </Link>
        </nav>
      </header>

      <main className="relative z-10 container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-purple-300 text-sm mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            Create your bio link in seconds
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up">
            One Link for{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              All Your Content
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Create a beautiful, customizable bio link page in seconds. Share all your important links with your audience in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.5)]">
                Create Your CNBio
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/u/codeninjavik">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10 rounded-2xl">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-32 max-w-5xl mx-auto">
          {[
            { icon: <Users className="w-8 h-8" />, title: "Unique Profiles", description: "Each user gets their own unique URL and customizable profile page." },
            { icon: <Palette className="w-8 h-8" />, title: "Beautiful Design", description: "Stunning animations, dark/light mode, and professional aesthetics." },
            { icon: <LinkIcon className="w-8 h-8" />, title: "Free 2 Links", description: "Start with 2 free links, share with friends to unlock more!" }
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] animate-slide-up"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center text-purple-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer with Social Links */}
      <footer className="relative z-10 border-t border-white/10 py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-8">
            {/* Social Links */}
            <div className="text-center">
              <p className="text-gray-400 mb-4">Follow CodeNinjaVik</p>
              <div className="flex gap-4 justify-center">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 bg-white/5 rounded-xl border border-white/10 text-gray-400 transition-all duration-300 hover:scale-110 ${social.color}`}
                    title={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-6 text-sm text-gray-500">
              <Link to="/about" className="hover:text-purple-400 transition-colors">About</Link>
              <Link to="/contact" className="hover:text-purple-400 transition-colors">Contact</Link>
              <Link to="/auth" className="hover:text-purple-400 transition-colors">Sign In</Link>
            </div>

            {/* Copyright */}
            <p className="text-gray-500 flex items-center gap-1 text-sm">
              Made with <Heart className="w-4 h-4 text-red-500" /> by CodeNinjaVik
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;