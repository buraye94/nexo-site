# Nexo — SEO Consulting Website

## ⚡ Quick Start (Get Live in Under 1 Hour)

### Step 1: Set Up GitHub Repo (5 min)
```bash
# Create a new repo on github.com called "nexo-site"
# Then in your terminal:
cd nexo-site
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nexo-site.git
git push -u origin main
```

### Step 2: Deploy to Cloudflare Pages (10 min)
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Create a free account (if you don't have one)
3. Go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
4. Select your `nexo-site` repo
5. Set build settings:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Click **Save and Deploy**
7. Wait ~2 minutes for the build

Your site is now live at `nexo-site.pages.dev` 🎉

### Step 3: Buy Domain via Cloudflare (5 min)
1. In Cloudflare dashboard → **Domain Registration** → **Register Domain**
2. Search for your brand name `.com`
3. Purchase (~$10/year)
4. Go to **Workers & Pages** → your project → **Custom Domains**
5. Add your domain → Cloudflare handles DNS automatically

### Step 4: Set Up Google Workspace (15 min)
1. Go to [workspace.google.com](https://workspace.google.com)
2. Choose **Starter** plan ($7.20/user/month)
3. Enter your domain
4. Create 2 email accounts (e.g., `felipe@yourdomain.com`, `info@yourdomain.com`)

#### DNS Records to Add in Cloudflare:
Google will give you specific records, but typically:

**MX Records:**
| Priority | Value |
|----------|-------|
| 1 | ASPMX.L.GOOGLE.COM |
| 5 | ALT1.ASPMX.L.GOOGLE.COM |
| 5 | ALT2.ASPMX.L.GOOGLE.COM |
| 10 | ALT3.ASPMX.L.GOOGLE.COM |
| 10 | ALT4.ASPMX.L.GOOGLE.COM |

**TXT Record (SPF):**
```
v=spf1 include:_spf.google.com ~all
```

**TXT Record (Domain verification):**
Google will provide this during setup.

**DKIM:**
Go to Google Admin → Apps → Google Workspace → Gmail → Authenticate Email → Generate DKIM record → Add as CNAME in Cloudflare.

**DMARC (recommended):**
```
_dmarc.yourdomain.com TXT "v=DMARC1; p=quarantine; rua=mailto:felipe@yourdomain.com"
```

### Step 5: Set Up Decap CMS Authentication (10 min)
The CMS needs GitHub OAuth to let you log in. Two options:

**Option A: Netlify Identity (easiest, free)**
1. Create a free Netlify account
2. Create a new site (just for auth — not for hosting)
3. Enable Identity → Registration → Invite only
4. Enable Git Gateway
5. Update `public/admin/config.yml`:
   ```yaml
   backend:
     name: git-gateway
   ```

**Option B: GitHub OAuth App**
1. Go to GitHub Settings → Developer Settings → OAuth Apps → New
2. Set callback URL to your domain
3. Use a serverless function for the OAuth callback

### Step 6: Test Everything (5 min)
- [ ] Visit `yourdomain.com` → should redirect to `/en/`
- [ ] Toggle to Spanish → should go to `/es/`
- [ ] Click through all sections
- [ ] Test contact form
- [ ] Visit `yourdomain.com/admin/` → CMS login
- [ ] Send test email from Google Workspace

---

## 🛠 Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/     # Reusable components (Nav, etc.)
├── content/        # CMS-managed content
│   ├── blog/       # Blog posts (EN + ES)
│   ├── cases/      # Case studies
│   └── testimonials/ # Client testimonials
├── i18n/           # Translations (en.json, es.json)
├── layouts/        # Page layouts
├── pages/          # Route pages
│   ├── en/         # English pages
│   └── es/         # Spanish pages
└── styles/         # Global styles
public/
└── admin/          # Decap CMS dashboard
```

## ✏️ Editing Content

### Via CMS (recommended)
Visit `yourdomain.com/admin/` to add/edit:
- Blog posts (EN + ES)
- Testimonials
- Case studies

### Via Code
Edit JSON/Markdown files directly in `src/content/` and push to GitHub.

## 🔄 Changing the Brand Name
Search and replace "nexo" / "Nexo" across:
1. `src/components/Nav.astro`
2. `src/pages/en/index.astro` and `src/pages/es/index.astro`
3. `src/i18n/en.json` and `src/i18n/es.json`
4. `astro.config.mjs` (site URL)
5. `public/admin/config.yml` (site_url, repo)
6. This README

## 📧 Contact Form
Currently using a client-side simulation. To connect to a real backend:

### Formspree (free, easiest)
1. Sign up at [formspree.io](https://formspree.io)
2. Create a form → get your form ID
3. Update the form action in `en/index.astro` and `es/index.astro`:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

### Cloudflare Workers (free, no third-party)
Create a Worker that receives form data and sends via email API.
