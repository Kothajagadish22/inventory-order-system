# Personal GitHub — This Folder Only

Your **global** git may still be your company account:

```
user.name  = kothajagadish-a11y
user.email = kotha.jagadish@anakin.company
```

This project uses **local** git config inside `Assignment_2/` only. Other folders are **not affected**.

## Quick setup (recommended)

```powershell
cd C:\Users\Anakin\Desktop\Assignment_2
.\setup_personal_git.ps1
```

Uses your **personal** GitHub account (`Kothajagadish22` by default), not company.

## What stays isolated

| Setting | Scope | Affects other folders? |
|---------|--------|-------------------------|
| `git config --local user.email` | This folder only | No |
| `git remote origin` | This folder only | No |
| Company global config | Everywhere else | Unchanged |

## Step-by-step

### 1. Run the setup script

```powershell
.\setup_personal_git.ps1
```

### 2. Create a public repo on your personal GitHub

1. Log in to your **personal** GitHub (`Kothajagadish22`)
2. **New repository** → name e.g. `inventory-order-system`
3. Set visibility to **Public**
4. Do **not** add README, .gitignore, or license (we already have them)

### 3. Add remote and push

```powershell
git remote add origin https://github.com/Kothajagadish22/inventory-order-system.git
git add .
git commit -m "Technical Assessment: Inventory and Order Management System"
git branch -M main
git push -u origin main
```

### 4. Verify on GitHub

Open: `https://github.com/Kothajagadish22/inventory-order-system`

You should see `backend/`, `frontend/`, `docker-compose.yml`, and `README.md`.

## Login: personal vs company GitHub

If `git push` uses the wrong account:

**Option A — HTTPS (simplest)**  
When prompted, sign in with your **personal** GitHub account (`Kothajagadish22`).

**Option B — SSH (best for two accounts)**  
Use a personal SSH key for this repo only (see Assigment `GIT_SETUP.md` for full steps).

## Files not pushed (in .gitignore)

- `backend/.venv/` — Python virtual environment
- `frontend/node_modules/` — npm packages
- `frontend/dist/` — build output
- `.env` — secrets (use `.env.example` instead)

## Verify local config

```powershell
git config --local --list    # this folder only
git config --global --list   # company (unchanged)
```
