// Analytics — configured for session logs
const ANALYTICS_CONFIG = {
  enabled: true,
  firebaseDatabaseUrl: 'https://for-kasya-tersayang-default-rtdb.asia-southeast1.firebasedatabase.app',
  // Phone alert when she unlocks with 1406 only — subscribe in ntfy app
  ntfyTopic: 'kasya-unlock-adamnibosh-x7k9p2',
  // Telegram alert (same moment as ntfy)
  telegramBotToken: '8599192715:AAHRqH3k3KEQKMoFh4DgK5X1czTfsvGxcRA',
  telegramChatId: '992468561'
};
window.ANALYTICS_CONFIG = ANALYTICS_CONFIG;