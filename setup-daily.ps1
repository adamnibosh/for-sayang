$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "=== Add daily note (append only - old notes stay) ===" -ForegroundColor Magenta
Write-Host "Today: $(Get-Date -Format 'yyyy-MM-dd')" -ForegroundColor Cyan
Write-Host ""

$text = Read-Host "Note for Kasya (main message)"
$text = $text.Trim()
if (-not $text) {
    Write-Host "Cancelled - no text entered." -ForegroundColor Red
    exit 1
}

$sub = Read-Host "Small sub-line (Enter to skip)"
$sub = $sub.Trim()

$jsonPath = Join-Path $PSScriptRoot "daily.json"
$raw = Get-Content -Path $jsonPath -Raw -Encoding UTF8
$notes = @()
if ($raw.Trim()) {
    $notes = @($raw | ConvertFrom-Json)
}

$today = Get-Date -Format "yyyy-MM-dd"
$entry = [ordered]@{ date = $today; text = $text }
if ($sub) { $entry.sub = $sub }

$notes += [pscustomobject]$entry
$json = $notes | ConvertTo-Json -Depth 4
if ($notes.Count -eq 1) {
    $json = "[$json]"
}
[System.IO.File]::WriteAllText($jsonPath, $json + "`n", [System.Text.UTF8Encoding]::new($false))

Write-Host ""
Write-Host "Added note for $today ($($notes.Count) total)" -ForegroundColor Green
Write-Host "Deploying to GitHub..." -ForegroundColor Cyan

git add daily.json
if ($LASTEXITCODE -ne 0) { throw "git add failed" }
git commit -m "Daily note for $today"
if ($LASTEXITCODE -ne 0) { throw "git commit failed" }
git push origin main
if ($LASTEXITCODE -ne 0) { throw "git push failed" }

Write-Host ""
Write-Host "DONE. Sayang will see it in daily dari baby on the site." -ForegroundColor Green
Write-Host ""