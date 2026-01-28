export default function urlQuery(name) {
  const params = new URLSearchParams(window.location.search);

  // in case it's an array like filter[key1]=value1&filter[key2]=value2
  let state = null;

  const entries = [...params.entries()];

  for (const [key, value] of entries) {
    if (key.startsWith(name + '[') && key.endsWith(']')) {
      // Extract the part between the brackets after the name
      const bracketContent = key.slice(name.length + 1, -1);

      // Split by '][' to handle nested brackets like filter[planned_at][from]
      const fieldKeys = bracketContent.split('][');

      state ||= {};

      // Navigate/create the nested structure
      let current = state;
      for (let i = 0; i < fieldKeys.length - 1; i++) {
        const fieldKey = fieldKeys[i];
        current[fieldKey] ||= {};
        current = current[fieldKey];
      }

      // Set the final value
      const finalKey = fieldKeys[fieldKeys.length - 1];
      current[finalKey] = value;
    }
  }

  return state || params.get(name) || null;
}