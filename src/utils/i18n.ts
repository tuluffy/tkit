export function i18n(
  id: string,
  defaultMessage?: string,
  values: { [name: string]: string | number | null | undefined } = {}
) {
  const hasMessage = id in LocalDataMessages.messages;
  if (process.env.NODE_ENV === 'development' && !hasMessage) {
    console.error(
      `[Inner i18n] Missing message: "${id}" for locale: "${LocalDataMessages.locale}"`
    );
  }
  const message = hasMessage ? LocalDataMessages.messages[id] : defaultMessage;
  if (message) {
    return `${message}`.replace(
      /\{([a-z0-9_\$]+)\}/gi,
      (all, name) => `${values[name] == null ? '' : values[name]}`
    );
  }
  return message;
}
