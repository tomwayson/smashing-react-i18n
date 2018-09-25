// NOTE: in ExB, we'd likely use SystemJS to load the JSON files
// in order to ensure that they are not loaded more than once
export function fetchJson(url) {
  return fetch(url).then(response => response.ok && response.json());
}
