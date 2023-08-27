export function formatDate(input) {
    const date = new Date(input);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed in JS
    const year = String(date.getFullYear()).slice(-2); // Get the last two characters of the year

    return `${day}/${month}/${year}`;
}
