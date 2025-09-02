/**
 * formatDate.js
 * ----------------
 * Created: 01-08-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Formatter for the DOB from current users to be DD/MM/YYYY
 *
 * (Rani et al., 2021)
 */

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};
