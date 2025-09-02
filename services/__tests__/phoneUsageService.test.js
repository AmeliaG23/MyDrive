/**
 * phoneUsageService.test.js
 * ----------------
 * Created: 01-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Functional tests for phoneUsageService.js
 *
 * (Rani et al., 2021)
 */

import CallDetectorManager from 'react-native-call-detection';
import { startCallDetection, stopCallDetection } from '../phoneUsageService';

describe('phoneUsageService', () => {
    let mockDispose;

    beforeEach(() => {
        mockDispose = jest.fn();
        CallDetectorManager.mockImplementation((callback) => {
            callback('Incoming');
            callback('Disconnected');
            return { dispose: mockDispose };
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('startCallDetection sets status correctly', () => {
        const statusUpdates = [];
        startCallDetection(status => statusUpdates.push(status));
        expect(statusUpdates).toEqual([true, false]);
    });

    test('stopCallDetection calls dispose', () => {
        startCallDetection(() => { });
        stopCallDetection();
        expect(mockDispose).toHaveBeenCalledTimes(1);
    });

    test('stopCallDetection does nothing if callDetector is null', () => {
        stopCallDetection();
        expect(mockDispose).not.toHaveBeenCalled();
    });
});
