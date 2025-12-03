-- Create user roles enum and table for security
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Policy for user_roles: users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Add user_id column to biolink_profiles to link to auth users
ALTER TABLE public.biolink_profiles 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create unique constraint on username
ALTER TABLE public.biolink_profiles 
ADD CONSTRAINT biolink_profiles_username_unique UNIQUE (username);

-- Drop old RLS policies on biolink_profiles
DROP POLICY IF EXISTS "Admin can delete profiles" ON public.biolink_profiles;
DROP POLICY IF EXISTS "Admin can insert profiles" ON public.biolink_profiles;
DROP POLICY IF EXISTS "Admin can update profiles" ON public.biolink_profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.biolink_profiles;

-- New RLS policies for biolink_profiles
CREATE POLICY "Anyone can view profiles"
ON public.biolink_profiles
FOR SELECT
USING (true);

CREATE POLICY "Users can insert own profile"
ON public.biolink_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON public.biolink_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
ON public.biolink_profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Add user_id to biolink_links and update foreign key
ALTER TABLE public.biolink_links 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop old RLS policies on biolink_links
DROP POLICY IF EXISTS "Admin can delete links" ON public.biolink_links;
DROP POLICY IF EXISTS "Admin can insert links" ON public.biolink_links;
DROP POLICY IF EXISTS "Admin can update links" ON public.biolink_links;
DROP POLICY IF EXISTS "Anyone can view links" ON public.biolink_links;

-- New RLS policies for biolink_links
CREATE POLICY "Anyone can view links"
ON public.biolink_links
FOR SELECT
USING (true);

CREATE POLICY "Users can insert own links"
ON public.biolink_links
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own links"
ON public.biolink_links
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own links"
ON public.biolink_links
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Function to auto-create user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  RETURN new;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();