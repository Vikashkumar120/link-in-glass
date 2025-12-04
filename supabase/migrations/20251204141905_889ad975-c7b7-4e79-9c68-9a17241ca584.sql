-- Add shares_count column to track WhatsApp shares for unlocking more links
ALTER TABLE public.biolink_profiles
ADD COLUMN shares_count integer DEFAULT 0;

-- Add links_unlocked column to track if user has unlocked unlimited links
ALTER TABLE public.biolink_profiles
ADD COLUMN links_unlocked boolean DEFAULT false;