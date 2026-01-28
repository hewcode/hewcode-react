export default function setUrlQuery(name, value, href = window.location.href) {
  const url = new URL(href);

  url.searchParams.delete(name);

  const entries = [...url.searchParams.entries()];

  // in case it's an array, we need to handle it differently
  for (const [key] of entries) {
    if (key.startsWith(`${name}[`) && key.endsWith(']')) {
      url.searchParams.delete(key);
    }
  }

  return [url.toString(), value ? { [name]: value } : {}];
}
