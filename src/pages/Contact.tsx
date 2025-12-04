import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, MapPin, Phone, Heart, Youtube, Github, Instagram, Twitter, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import codeNinjaLogo from '@/assets/codeninja-logo.jpg';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const socialLinks = [
    { icon: <Youtube className="w-5 h-5" />, url: 'https://youtube.com/@codeninjavik', label: 'YouTube', color: 'hover:bg-red-500/20 hover:text-red-400' },
    { icon: <Github className="w-5 h-5" />, url: 'https://github.com/codeninjavik', label: 'GitHub', color: 'hover:bg-gray-500/20 hover:text-white' },
    { icon: <Instagram className="w-5 h-5" />, url: 'https://instagram.com/codeninjavik', label: 'Instagram', color: 'hover:bg-pink-500/20 hover:text-pink-400' },
    { icon: <Send className="w-5 h-5" />, url: 'https://t.me/codeninjavik', label: 'Telegram', color: 'hover:bg-blue-500/20 hover:text-blue-400' },
    { icon: <Twitter className="w-5 h-5" />, url: 'https://twitter.com/codeninjavik', label: 'Twitter', color: 'hover:bg-sky-500/20 hover:text-sky-400' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent!",
      description: "Thanks for reaching out. We'll get back to you soon!",
    });
    
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

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
          <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
          <Link to="/contact" className="text-purple-400 font-medium">Contact</Link>
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
          <h1 className="text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-gray-300">
            Have questions? We'd love to hear from you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  required
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 min-h-[150px]"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Mail className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Email</h3>
                  <a href="mailto:contact@codeninjavik.com" className="text-gray-400 hover:text-purple-400 transition-colors">
                    contact@codeninjavik.com
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <MessageCircle className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Telegram</h3>
                  <a href="https://t.me/codeninjavik" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                    @codeninjavik
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-500/20 rounded-xl">
                  <MapPin className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Location</h3>
                  <p className="text-gray-400">India 🇮🇳</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30">
              <h3 className="text-white font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-3 flex-wrap">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 bg-white/5 rounded-xl border border-white/10 text-gray-400 transition-all duration-300 ${social.color}`}
                    title={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
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

export default Contact;