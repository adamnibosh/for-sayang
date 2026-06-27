// Analytics — configured for session logs
const ANALYTICS_CONFIG = {
  enabled: true,
  firebaseDatabaseUrl: 'https://for-kasya-tersayang-default-rtdb.asia-southeast1.firebasedatabase.app',
  // Phone alert when she unlocks with 1406 only — subscribe in ntfy app
  ntfyTopic: 'kasya-unlock-adamnibosh-x7k9p2',
  // Telegram alert (same moment as ntfy) — run setup-telegram.ps1 to fill these in
  telegramBotToken: '',
  telegramChatId: ''
};