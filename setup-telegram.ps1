$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "`n=== Telegram alerts for for-kasya-tersayang ===" -ForegroundColor Magenta
Write-Host "You will get a Telegram message when she unlocks with 1406.`n" -ForegroundColor Cyan

Write-Host "1) Open Telegram -> search @BotFather" -ForegroundColor Yellow
Write-Host "2) Send /newbot and follow steps to create your bot" -ForegroundColor Yellow
Write-Host "3) Copy the bot token (looks like 123456789:ABCdef...)" -ForegroundColor Yellow
Write-Host "4) Open YOUR new bot in Telegram and tap Start" -ForegroundColor Yellow
Write-Host "5) Send any message to your bot (e.g. hi)`n" -ForegroundColor Yellow

$token = Read-Host "Paste bot token"
$token = $token.Trim()
if (-not $token) { Write-Host "No token entered. Cancelled." -ForegroundColor Red; exit 1 }

Write-Host "`nFetching your chat id from Telegram..." -ForegroundColor Cyan
$updatesUrl = "https://api.telegram.org/bot$token/getUpdates"
try {
    $resp = Invoke-RestMethod -Uri $updatesUrl -Method Get
} catch {
    Write-Host "Could not reach Telegram. Check token and internet." -ForegroundColor Red
    exit 1
}

$chatId = $null
if ($resp.ok -and $resp.result.Count -gt 0) {
    $chatId = $resp.result[-1].message.chat.id
}

if (-not $chatId) {
    Write-Host "No message found yet." -ForegroundColor Yellow
    Write-Host "Open your bot in Telegram, tap Start, send 'hi', then press Enter here." -ForegroundColor Yellow
    Read-Host "Press Enter when done"
    $resp = Invoke-RestMethod -Uri $updatesUrl -Method Get
    if ($resp.ok -and $resp.result.Count -gt 0) {
        $chatId = $resp.result[-1].message.chat.id
    }
}

if (-not $chatId) {
    Write-Host "Still no chat id. Open this in browser after messaging your bot:" -ForegroundColor Red
    Write-Host $updatesUrl -ForegroundColor White
    $chatId = Read-Host "Paste chat id from the JSON (message.chat.id)"
}

$configPath = Join-Path $PSScriptRoot "analytics-config.js"
$existing = Get-Content -Path $configPath -Raw -Encoding UTF8

$firebaseMatch = [regex]::Match($existing, "firebaseDatabaseUrl:\s*'([^']+)'")
$ntfyMatch = [regex]::Match($existing, "ntfyTopic:\s*'([^']+)'")
$firebase = if ($firebaseMatch.Success) { $firebaseMatch.Groups[1].Value } else { '' }
$ntfy = if ($ntfyMatch.Success) { $ntfyMatch.Groups[1].Value } else { '' }

$content = @"
// Analytics — configured for session logs
const ANALYTICS_CONFIG = {
  enabled: true,
  firebaseDatabaseUrl: '$firebase',
  // Phone alert when she unlocks with 1406 only — subscribe in ntfy app
  ntfyTopic: '$ntfy',
  // Telegram alert (same moment as ntfy)
  telegramBotToken: '$token',
  telegramChatId: '$chatId'
};
"@
Set-Content -Path $configPath -Value $content -Encoding UTF8

Write-Host "`nSending test message to your Telegram..." -ForegroundColor Cyan
$testText = "Kasya site alerts are connected. You will get a message when she enters 1406."
$testUrl = "https://api.telegram.org/bot$token/sendMessage"
$testBody = @{ chat_id = $chatId; text = $testText } | ConvertTo-Json
try {
    Invoke-RestMethod -Uri $testUrl -Method Post -ContentType "application/json" -Body $testBody | Out-Null
    Write-Host "Test message sent — check Telegram." -ForegroundColor Green
} catch {
    Write-Host "Saved config but test message failed. Check token/chat id." -ForegroundColor Yellow
}

Write-Host "`nDeploying to GitHub..." -ForegroundColor Cyan
git add analytics-config.js
git commit -m "Enable Telegram unlock alerts"
git push origin main

Write-Host "`nDONE. Telegram + ntfy will alert on 1406 unlock.`n" -ForegroundColor Green