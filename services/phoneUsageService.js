/**
 * phoneUsageService.js
 * ----------------
 * Created: 19-08-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Detects phone usage whilst the app is running or in the background.
 * 
 * (Rani et al., 2021)
 */

import CallDetectorManager from 'react-native-call-detection';

let callDetector = null;

// Function for when call detection is started
export function startCallDetection(setStatusCallback) {
    // Event handler for call status
    callDetector = new CallDetectorManager(
        (event) => {
            if (event === 'Connected' || event === 'Incoming') {
                setStatusCallback(true); // On call
            } else {
                setStatusCallback(false); // Not on call
            }
        },
        true, // Enables phone status tracking whilst it is in the background
        () => { },
        {
            title: 'Phone State Permission',
            message: 'This app needs access to your phone state for call detection.',
        }
    );
}

// Function to stop call detection and stops unneccessary listeners
export function stopCallDetection() {
    if (callDetector) {
        callDetector.dispose();
    }
}

// (NPM, 2020)