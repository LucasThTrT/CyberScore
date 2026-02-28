export function formatDate(input) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return 'Unknown Date';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatRelativeMinutes(lastUpdated) {
  if (!lastUpdated) return 'Never';
  const diffMinutes = Math.max(0, Math.round((Date.now() - lastUpdated.getTime()) / 60000));
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes === 1) return '1 minute ago';
  return `${diffMinutes} minutes ago`;
}
