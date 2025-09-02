/**
 * react-navigation-native.js
 * ----------------
 * Created: 20-08-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    react-navigation-native mock to aid with testing of scoring architecture
 *
 * (Rani et al., 2021)
 */

export const useNavigation = () => ({
    setOptions: jest.fn(),
    navigate: jest.fn(),
    goBack: jest.fn(),
    // add other methods your tests use
});
