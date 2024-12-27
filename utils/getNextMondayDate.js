export function getNextMonday() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    const daysUntilMonday = (8 - dayOfWeek) % 7 || 7; // Days to next Monday
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilMonday);

    // Format the date as dd/mm/yyyy
    const day = String(nextMonday.getDate()).padStart(2, '0');
    const month = String(nextMonday.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = nextMonday.getFullYear();

    return `${day}/${month}/${year}`;
}