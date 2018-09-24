export function fetchJson(url) {
  return fetch(url).then(response => response.ok && response.json());
}
