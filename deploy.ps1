# =============================================================================
# Deploy backend (Render) + frontend (Vercel)
# =============================================================================
# Prerequisites:
#   1. Render: create Blueprint from this repo (render.yaml) OR set RENDER_API_KEY
#   2. Vercel: run `npx vercel login` once OR set VERCEL_TOKEN
#
# Usage:
#   .\deploy.ps1 -BackendUrl "https://inventory-backend-xxxx.onrender.com"
# =============================================================================

param(
    [Parameter(Mandatory = $true)]
    [string]$BackendUrl,

    [string]$CorsOrigins = "",
    [string]$VercelToken = $env:VERCEL_TOKEN
)

$ErrorActionPreference = "Stop"
$BackendUrl = $BackendUrl.TrimEnd("/")

Write-Host ""
Write-Host "=== Deployment helper ===" -ForegroundColor Cyan
Write-Host "Backend URL: $BackendUrl"
Write-Host ""

Write-Host "STEP 1 — Render backend" -ForegroundColor Yellow
Write-Host "  If not deployed yet:"
Write-Host "  1. Go to https://dashboard.render.com/blueprints"
Write-Host "  2. New Blueprint Instance -> connect GitHub repo: inventory-order-system"
Write-Host "  3. Apply render.yaml"
Write-Host "  4. In Render dashboard -> inventory-backend -> Environment:"
Write-Host "       CORS_ORIGINS = (set after Vercel deploy, or use your Vercel URL now)"
Write-Host ""
Write-Host "  Test backend:"
Write-Host "    $BackendUrl/health"
Write-Host "    $BackendUrl/docs"
Write-Host ""

Write-Host "STEP 2 — Vercel frontend" -ForegroundColor Yellow
Set-Location "$PSScriptRoot\frontend"

$env:VITE_API_URL = $BackendUrl

if ($VercelToken) {
    npx vercel --prod --yes --token $VercelToken --env "VITE_API_URL=$BackendUrl"
} else {
    Write-Host "  Running interactive Vercel deploy (login required on first run)..."
    npx vercel --prod --env "VITE_API_URL=$BackendUrl"
}

Write-Host ""
Write-Host "STEP 3 — Update Render CORS" -ForegroundColor Yellow
Write-Host "  After Vercel gives you a URL (e.g. https://inventory-order-system.vercel.app):"
Write-Host "  Render -> inventory-backend -> Environment -> set:"
Write-Host "    CORS_ORIGINS = https://your-vercel-url.vercel.app"
Write-Host "  Then Manual Deploy -> Deploy latest commit"
Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Green
