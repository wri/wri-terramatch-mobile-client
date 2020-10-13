//@flow

export function capitalizeFirstChar(text: string): string {
  return text.length > 0 ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

export function getValidUrl(text: string): string {
  return text.startsWith("https://") || text.startsWith("http://") ? text : "https://" + text;
}
