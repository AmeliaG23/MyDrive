/**
 * react-native-call-detection.js
 * ----------------
 * Created: 20-08-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    react-native-call-detection mock to aid with testing of scoring architecture
 *
 * (Rani et al., 2021)
 */

const CallDetectorManager = jest.fn().mockImplementation((callback) => {
    return {
        dispose: jest.fn(),
    };
});

export default CallDetectorManager;
