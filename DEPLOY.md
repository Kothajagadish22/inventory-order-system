# Deploy to Render + Vercel

Repo: https://github.com/Kothajagadish22/inventory-order-system

Deploy **backend first**, then **frontend**, then update **CORS**.

---

## Part 1 — Backend on Render (~10 min)

### 1. Create Render account
- Go to https://render.com and sign up (use GitHub login)

### 2. Deploy with Blueprint
1. Open https://dashboard.render.com/blueprints
2. Click **New Blueprint Instance**
3. Connect GitHub → select **`inventory-order-system`**
4. Render detects `render.yaml` → click **Apply**

This creates:
- PostgreSQL database (`inventory-db`)
- Web service (`inventory-backend`)

### 3. Wait for deploy
- First deploy takes ~5–10 minutes
- When live, copy your backend URL, e.g.:
  ```
  https://inventory-backend-xxxx.onrender.com
  ```

### 4. Test backend
Open in browser:
- `https://YOUR-BACKEND.onrender.com/health` → `{"status":"ok"}`
- `https://YOUR-BACKEND.onrender.com/docs` → Swagger UI

### 5. Set CORS (temporary — update after Vercel)
In Render → **inventory-backend** → **Environment**:
```
CORS_ORIGINS=*
```
Click **Save Changes** → service redeploys.

> After Vercel deploy, change this to your exact Vercel URL.

---

## Part 2 — Frontend on Vercel (~5 min)

### 1. Create Vercel account
- Go to https://vercel.com and sign up (use GitHub login)

### 2. Import project
1. Click **Add New → Project**
2. Import **`Kothajagadish22/inventory-order-system`**
3. Configure:

| Setting | Value |
|---------|--------|
| **Root Directory** | `frontend` (click Edit) |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 3. Environment variable (required)
Add before deploying:

| Name | Value |
|------|--------|
| `VITE_API_URL` | `https://YOUR-BACKEND.onrender.com` |

Use the **exact** Render backend URL from Part 1.

### 4. Deploy
Click **Deploy** → wait ~2 min → copy your URL, e.g.:
```
https://inventory-order-system.vercel.app
```

### 5. Test frontend
- Open your Vercel URL
- Add a product, customer, and order

---

## Part 3 — Fix CORS (final step)

1. Render → **inventory-backend** → **Environment**
2. Change `CORS_ORIGINS` from `*` to your Vercel URL:
   ```
   CORS_ORIGINS=https://inventory-order-system.vercel.app
   ```
3. **Save Changes** → redeploy

Test again on the live Vercel site.

---

## Part 4 — Docker Hub (submission item)

```powershell
cd C:\Users\Anakin\Desktop\Assignment_2
docker login
docker build -t Kothajagadish22/inventory-backend:latest ./backend
docker push Kothajagadish22/inventory-backend:latest
```

Docker Hub link:
```
https://hub.docker.com/r/Kothajagadish22/inventory-backend
```

---

## Final submission template

```
GitHub Repository:
https://github.com/Kothajagadish22/inventory-order-system

Docker Hub Backend Image:
https://hub.docker.com/r/Kothajagadish22/inventory-backend

Live Frontend URL:
https://YOUR-APP.vercel.app

Live Backend API URL:
https://YOUR-BACKEND.onrender.com
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Frontend loads, API fails | Check `VITE_API_URL` on Vercel, redeploy |
| CORS error in browser | Set `CORS_ORIGINS` on Render to exact Vercel URL |
| Backend 502 on first request | Render free tier sleeps — wait 30s and retry |
| Database connection error | Ensure `DATABASE_URL` is linked in Render env (Blueprint does this) |
| Build fails on Render | Check logs; Python 3.12 is set in `runtime.txt` |

---

## Optional: CLI deploy (after login)

```powershell
# Vercel (one-time login)
npx vercel login

# Deploy both with helper script
.\deploy.ps1 -BackendUrl "https://inventory-backend-xxxx.onrender.com"
```
