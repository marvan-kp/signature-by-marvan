# 🌐 100% FREE Options to Upload & Host Your Website

Here are the simplest and completely **FREE** ways to put **Signature by Marvan** live on the internet so clients and couples worldwide can access it.

---

## ⚡ OPTION 1: Instant Live Public Link Right Now (Takes 10 Seconds, No Signups)

If you want an immediate live HTTPS internet link to test on your phone or send to a client right this minute:

1. Open PowerShell in this project folder.
2. Run this command:
   ```powershell
   npx -y localtunnel --port 5173
   ```
3. It will give you a public URL (e.g., `https://friendly-camera-84.loca.lt`).
4. Anyone on mobile or desktop can open this link and experience your website immediately!

---

## ⚡ OPTION 2: Drag & Drop Free Hosting on Netlify (No Git / No Code Needed)

You already have the compiled production bundle ready in `frontend/dist`. You can host it online for free in 60 seconds without installing Git:

1. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)** (100% Free).
2. Open your Windows File Explorer and navigate to:
   `c:\Users\MARVANKP\Documents\wedding gallery\frontend\`
3. Drag the **`dist`** folder and drop it onto the Netlify webpage.
4. Netlify will instantly deploy your website and give you a free live URL (e.g., `https://signature-by-marvan.netlify.app`) with free SSL!

---

## ⚡ OPTION 3: 1-Click All-in-One Cloud Hosting on Render.com (Frontend + Backend)

To host the full-stack server (with live photo uploads, Sharp image processing, and database) permanently online for free:

1. Download **GitHub Desktop** ([desktop.github.com](https://desktop.github.com)) or create a free repo at [github.com](https://github.com).
2. Publish this project folder to GitHub.
3. Sign up at **[render.com](https://render.com)** (Free Tier).
4. Click **New +** -> **Web Service** and choose your repository.
5. Enter:
   * **Build Command:** `npm run install-all && npm run build`
   * **Start Command:** `npm start`
   * **Instance Type:** `Free`
6. Click **Deploy Web Service**!

Render will build and host both your frontend and backend on a free public domain (e.g. `https://signature-marvan.onrender.com`).

---

## ☁️ Free Cloud Storage Option for Photos (Cloudflare R2)

* In your Admin Dashboard -> **Storage & Free Quota**, select **Cloudflare R2 Free Tier** (gives you **10 GB free forever** with **$0 bandwidth transfer fees**), or choose **Unlimited Free Local Storage** to use your own computer's drive.
