// capitalizeFirstLetter
//   - takes a string and returns the same string with the first letter capitalized

export default function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}