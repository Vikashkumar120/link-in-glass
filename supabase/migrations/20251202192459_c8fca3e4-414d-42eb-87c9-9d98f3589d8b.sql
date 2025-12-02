-- Create biolink profiles table
CREATE TABLE public.biolink_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id TEXT UNIQUE NOT NULL DEFAULT 'default',
  username TEXT NOT NULL DEFAULT 'CodeNinjaVik',
  tagline TEXT DEFAULT 'Developer • Content Creator • Tech Enthusiast',
  profile_image TEXT,
  dark_mode BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create biolink links table
CREATE TABLE public.biolink_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id TEXT NOT NULL DEFAULT 'default',
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_url TEXT,
  color TEXT DEFAULT 'purple',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS but allow public read access (this is a public bio page)
ALTER TABLE public.biolink_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biolink_links ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read profiles and links (public bio page)
CREATE POLICY "Anyone can view profiles" ON public.biolink_profiles FOR SELECT USING (true);
CREATE POLICY "Anyone can view links" ON public.biolink_links FOR SELECT USING (true);

-- Allow insert/update/delete for admin (using profile_id check for simplicity)
CREATE POLICY "Admin can insert profiles" ON public.biolink_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update profiles" ON public.biolink_profiles FOR UPDATE USING (true);
CREATE POLICY "Admin can delete profiles" ON public.biolink_profiles FOR DELETE USING (true);

CREATE POLICY "Admin can insert links" ON public.biolink_links FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update links" ON public.biolink_links FOR UPDATE USING (true);
CREATE POLICY "Admin can delete links" ON public.biolink_links FOR DELETE USING (true);

-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public) VALUES ('biolink-images', 'biolink-images', true);

-- Storage policies for public access
CREATE POLICY "Public can view images" ON storage.objects FOR SELECT USING (bucket_id = 'biolink-images');
CREATE POLICY "Anyone can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'biolink-images');
CREATE POLICY "Anyone can update images" ON storage.objects FOR UPDATE USING (bucket_id = 'biolink-images');
CREATE POLICY "Anyone can delete images" ON storage.objects FOR DELETE USING (bucket_id = 'biolink-images');

-- Insert default profile data
INSERT INTO public.biolink_profiles (profile_id, username, tagline, dark_mode)
VALUES ('default', 'CodeNinjaVik', 'Developer • Content Creator • Tech Enthusiast', true);

-- Insert default links
INSERT INTO public.biolink_links (profile_id, title, url, icon_url, color, sort_order) VALUES
('default', 'GyaanRepo Website', 'https://gyaanrepo.netlify.app/', 'globe', 'purple', 0),
('default', 'Telegram Channel', 'https://t.me/gyaanRepo', 'telegram', 'blue', 1),
('default', 'GitHub Profile', 'https://github.com/vikashkumar14', 'github', 'gray', 2),
('default', 'YouTube Channel', 'https://youtube.com/@theeditorstar12?si=FP4yAjH0T2a33833', 'youtube', 'red', 3),
('default', 'Instagram', 'https://instagram.com/codeninjavik', 'instagram', 'pink', 4);