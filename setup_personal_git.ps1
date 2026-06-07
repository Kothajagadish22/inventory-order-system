# =============================================================================
# Personal Git setup — THIS FOLDER ONLY (does NOT change global/company config)
# =============================================================================
# Run from: C:\Users\Anakin\Desktop\Assignment_2
#   .\setup_personal_git.ps1
#
# Or with your details:
#   .\setup_personal_git.ps1 -GitHubUsername "Kothajagadish22" -GitName "Your Name" -GitEmail "you@gmail.com"
# =============================================================================

param(
    [string]$GitHubUsername = "Kothajagadish22",
    [string]$GitName = "Kothajagadish22",
    [string]$GitEmail = "19pa1a0345@vishnu.edu.in"
)

$ErrorActionPreference = "Stop"
$RepoRoot = $PSScriptRoot
Set-Location $RepoRoot

Write-Host ""
Write-Host "=== Personal Git setup (local to this folder only) ===" -ForegroundColor Cyan
Write-Host ""

if (-not $GitHubUsername) {
    $GitHubUsername = Read-Host "Your personal GitHub username"
}
if (-not $GitName) {
    $GitName = Read-Host "Your personal Git name"
}
if (-not $GitEmail) {
    $GitEmail = Read-Host "Your personal Git email (must match GitHub account)"
}

if (-not (Test-Path ".git")) {
    git init
    Write-Host "Created new git repo in: $RepoRoot" -ForegroundColor Green
} else {
    Write-Host "Git repo already exists." -ForegroundColor Yellow
}

git config --local user.name "$GitName"
git config --local user.email "$GitEmail"
git config --local init.defaultBranch main

Write-Host ""
Write-Host "--- Verification (local vs global) ---" -ForegroundColor Cyan
Write-Host "LOCAL  (this folder only):"
Write-Host "  user.name  = $(git config --local user.name)"
Write-Host "  user.email = $(git config --local user.email)"
Write-Host ""
Write-Host "GLOBAL (other folders - unchanged):"
Write-Host "  user.name  = $(git config --global user.name)"
Write-Host "  user.email = $(git config --global user.email)"
Write-Host ""

$existingRemote = git remote get-url origin 2>$null
if (-not $existingRemote) {
    $repoName = Read-Host "GitHub repo name (e.g. inventory-order-system)"
    if ($repoName) {
        Write-Host ""
        Write-Host "Add remote AFTER you create the repo on GitHub:" -ForegroundColor Yellow
        Write-Host "  HTTPS: git remote add origin https://github.com/$GitHubUsername/$repoName.git"
        Write-Host ""
        $addNow = Read-Host "Create remote now? (y/n)"
        if ($addNow -eq "y") {
            git remote add origin "https://github.com/$GitHubUsername/$repoName.git"
            Write-Host "Remote 'origin' added." -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Green
Write-Host "This folder uses your PERSONAL identity. Company global config is unchanged."
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Create a PUBLIC repo on github.com/$GitHubUsername (no README/license)"
Write-Host "  2. git add ."
Write-Host "  3. git commit -m `"Technical Assessment: Inventory and Order Management System`""
Write-Host "  4. git push -u origin main"
Write-Host ""
