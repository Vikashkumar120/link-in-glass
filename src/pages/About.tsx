import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code, Heart, Zap, Users, Sparkles, Youtube, Github, Instagram, Send, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import codeNinjaLogo from '@/assets/codeninja-logo.jpg';

const About = () => {
  const socialLinks = [
    { icon: <Youtube className="w-5 h-5" />, url: 'https://youtube.com/@codeninjavik', label: 'YouTube', color: 'hover:bg-red-500/20 hover:text-red-400' },
    { icon: <Github className="w-5 h-5" />, url: 'https://github.com/codeninjavik', label: 'GitHub', color: 'hover:bg-gray-500/20 hover:text-white' },
    { icon: <Instagram className="w-5 h-5" />, url: 'https://instagram.com/codeninjavik', label: 'Instagram', color: 'hover:bg-pink-500/20 hover:text-pink-400' },
    { icon: <Send className="w-5 h-5" />, url: 'https://t.me/codeninjavik', label: 'Telegram', color: 'hover:bg-blue-500/20 hover:text-blue-400' },
    { icon: <Twitter className="w-5 h-5" />, url: 'https://twitter.com/codeninjavik', label: 'Twitter', color: 'hover:bg-sky-500/20 hover:text-sky-400' },
  ];

  return (
    <div className="min-h-screen bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-900 via-purple-900/50 to-gray-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={codeNinjaLogo} alt="CNBio" className="w-10 h-10 rounded-xl" />
          <span className="text-2xl font-bold text-white">CNBio</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/about" className="text-purple-400 font-medium">About</Link>
          <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
          <Link to="/auth">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              Get Started
            </Button>
          </Link>
        </nav>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-16 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <img src={codeNinjaLogo} alt="Code Ninja" className="w-32 h-32 rounded-full border-4 border-purple-500/50 shadow-2xl" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">About CNBio</h1>
          <p className="text-xl text-gray-300">
            Created by <span className="text-purple-400 font-semibold">CodeNinjaVik</span> - Developer, Content Creator & Tech Enthusiast
          </p>
        </div>

        {/* About Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <Code className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Developer First</h3>
            <p className="text-gray-400">
              Built by developers, for everyone. CNBio is designed to be simple, fast, and beautiful.
            </p>
          </div>
          <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <Zap className="w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-gray-400">
              Create your bio link in seconds. No complicated setup, just sign up and start sharing.
            </p>
          </div>
          <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <Users className="w-10 h-10 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Growing Community</h3>
            <p className="text-gray-400">
              Join thousands of creators who trust CNBio for their link-in-bio needs.
            </p>
          </div>
          <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <Sparkles className="w-10 h-10 text-pink-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Beautiful Design</h3>
            <p className="text-gray-400">
              Stunning animations, dark/light mode, and professional aesthetics out of the box.
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="p-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30 mb-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-gray-300 text-lg">
            To provide every creator, entrepreneur, and individual with a beautiful, free way to share all their important links in one place. Made in India with ❤️
          </p>
        </div>

        {/* Social Links */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-6">Follow CodeNinjaVik</h3>
          <div className="flex justify-center gap-4 flex-wrap">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 bg-white/5 rounded-xl border border-white/10 text-gray-400 transition-all duration-300 ${social.color}`}
                title={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500" /> by CodeNinjaVik
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;