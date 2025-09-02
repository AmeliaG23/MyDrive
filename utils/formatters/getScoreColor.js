/**
 * getScoreColor.js
 * ----------------
 * Created: 02-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Formatter to decide on Score color
 * 
 * (Rani et al., 2021)
 */

export const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#F9A800';
    return '#F44336';
}