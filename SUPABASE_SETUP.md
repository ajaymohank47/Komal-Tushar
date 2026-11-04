# Supabase Setup Guide

Follow these steps to enable photo uploads on the wedding admin panel.

---

## 1. Create a Supabase Account

Go to [https://supabase.com](https://supabase.com) and sign up for a free account.

---

## 2. Create a New Project

1. Click **New Project**
2. Choose your organization
3. Enter a project name (e.g. `komal-tushar-wedding`)
4. Set a strong database password (save it somewhere safe)
5. Choose the region closest to you
6. Click **Create new project** and wait ~2 minutes

---

## 3. Create the `wedding_images` Table

In the Supabase dashboard, go to **SQL Editor** and run:

```sql
-- Create table to store slot → URL mappings
CREATE TABLE IF NOT EXISTS wedding_images (
  slot       TEXT PRIMARY KEY,
  image_url  TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow anyone to read (public site needs to fetch image URLs)
ALTER TABLE wedding_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access"
  ON wedding_images FOR SELECT
  USING (true);

-- Allow anyone to insert/update (admin panel uploads)
CREATE POLICY "Public insert access"
  ON wedding_images FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public update access"
  ON wedding_images FOR UPDATE
  USING (true);
```

> **Note:** These are open policies for simplicity. The admin panel is password-protected (`komal2026`). For extra security you can add Supabase Auth later.

---

## 4. Create the `wedding-photos` Storage Bucket

1. In the sidebar, click **Storage**
2. Click **New bucket**
3. Name it exactly: `wedding-photos`
4. Toggle **Public bucket** to ON
5. Click **Create bucket**

Then set the storage policy — go to **Policies** tab on the bucket and run this SQL in the editor:

```sql
-- Allow anyone to upload and read photos
CREATE POLICY "Public uploads"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'wedding-photos');

CREATE POLICY "Public downloads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'wedding-photos');
```

Or more simply: in the **Storage** section, click on the `wedding-photos` bucket → **Policies** → **New Policy** → **For full customization** → allow `SELECT` and `INSERT` for all roles.

---

## 5. Get Your Project Credentials

1. In the Supabase dashboard, go to **Settings → API**
2. Copy:
   - **Project URL** (looks like `https://xxxxxxxxxxxx.supabase.co`)
   - **anon public** key (long string under "Project API Keys")

---

## 6. Create the `.env` File

In the root of the project (`c:\Users\Ajaymohan\ZZ\Sarvesh`), create a file named `.env`:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with what you copied in step 5.

> **Important:** Never commit `.env` to git. It is already in `.gitignore`.

After creating `.env`, restart the dev server:
```
npm run dev
```

---

## 7. Test the Admin Panel Locally

Visit [http://localhost:5173/admin](http://localhost:5173/admin)

- Password: `komal2026`
- Try uploading a photo to any slot
- If it works, the preview should update and the image will persist on refresh

---

## 8. Deploy to Vercel

1. Push the project to a GitHub repository
2. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub
3. Click **Add New → Project** and import your repository
4. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
5. Click **Deploy**

---

## 9. Access the Admin Panel on Production

Visit `https://yourdomain.vercel.app/admin`

Since this is a Vite SPA (single-page app), you need to tell Vercel to route all paths to `index.html`. Create `vercel.json` in the project root:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

This ensures `/admin` loads the React app instead of returning a 404.

---

## Image Slot Reference

| Slot ID           | Location on Site              |
|-------------------|-------------------------------|
| `hero`            | Hero background photo         |
| `story-1`         | Story timeline — entry 1      |
| `story-2`         | Story timeline — entry 2      |
| `story-3`         | Story timeline — entry 3      |
| `story-4`         | Story timeline — entry 4      |
| `story-5`         | Story timeline — entry 5      |
| `gallery-1`       | Photo gallery — slot 1        |
| `gallery-2`       | Photo gallery — slot 2        |
| `gallery-3`       | Photo gallery — slot 3        |
| `gallery-4`       | Photo gallery — slot 4        |
| `gallery-5`       | Photo gallery — slot 5        |
| `gallery-6`       | Photo gallery — slot 6        |
| `gallery-7`       | Photo gallery — slot 7        |
| `gallery-8`       | Photo gallery — slot 8        |
| `gallery-9`       | Photo gallery — slot 9        |
| `family-dayanand` | Dayanand Pawar (groom's father) |

