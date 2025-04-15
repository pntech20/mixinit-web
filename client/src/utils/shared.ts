export function convertObjectToArray(data) {
  try {
    return Object.entries(data).map(([key, value]) => {
      const formattedKey = key
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase letters
        .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter of the key
      return `${formattedKey}: ${value}`;
    });
  } catch (error) {
    return [];
  }
}

// const data = { trackId: 'abc', downloadTime: '12/12/1212' };
// const result = convertObjectToArray(data);
// console.log(result);
// Output: ["Track Id: abc", "Download Time: 12/12/1212"]
