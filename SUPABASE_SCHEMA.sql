
-- SUPABASE SCHEMA FOR PAYSLIP PORTAL

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- Note: In production, use Supabase Auth or hashed passwords
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teachers Table
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shalarth_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT,
  designation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Paybills Table (Master Records)
CREATE TABLE IF NOT EXISTS paybills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month TEXT NOT NULL,
  year TEXT NOT NULL,
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  record_count INTEGER DEFAULT 0
);

-- Salary Data Table (Individual records linked to paybills)
CREATE TABLE IF NOT EXISTS salary_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paybill_id UUID REFERENCES paybills(id) ON DELETE CASCADE,
  shalarth_id TEXT NOT NULL,
  employee_name TEXT,
  raw_data JSONB NOT NULL, -- Stores all columns from Excel
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  date TEXT NOT NULL,
  file_url TEXT,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Info Requests Table (Admin asking teachers for data)
CREATE TABLE IF NOT EXISTS info_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  column_headers JSONB NOT NULL, -- Array of strings
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Info Responses Table (Teachers submitting data)
CREATE TABLE IF NOT EXISTS info_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES info_requests(id) ON DELETE CASCADE,
  teacher_id TEXT NOT NULL, -- Shalarth ID
  responses JSONB NOT NULL, -- Object mapping header to value
  status TEXT DEFAULT 'Pending',
  submitted_date TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_request_teacher UNIQUE (request_id, teacher_id)
);

-- Insert a default manager row is not needed if using MANAGER_USER_ID from constants,
-- but for persistence, we could use a managers table. 
-- For now, we'll stick to the requested structure.

-- SUPABASE STORAGE SETUP (Run in SQL Editor)
-- Required for Notification File Uploads
-- 
-- insert into storage.buckets (id, name, public)
-- values ('notifications', 'notifications', true)
-- on conflict (id) do nothing;
-- 
-- create policy "Public Access"
-- on storage.objects for select
-- using ( bucket_id = 'notifications' );
-- 
-- create policy "Admin Upload"
-- on storage.objects for insert
-- with check ( bucket_id = 'notifications' );
