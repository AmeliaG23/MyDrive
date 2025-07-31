import CallDetectorManager from 'react-native-call-detection';
import { startCallDetection, stopCallDetection } from './phoneUsageService';

jest.mock('react-native-call-detection');

describe('phoneUsageService', () => {
    let mockDispose;

    beforeEach(() => {
        mockDispose = jest.fn();
        CallDetectorManager.mockImplementation((callback, flag, errorCallback, options) => {
            // Simulate the detector calling the callback with events after creation
            setTimeout(() => {
                callback('Incoming');
                callback('Disconnected');
            }, 0);
            return { dispose: mockDispose };
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('startCallDetection sets status correctly on call events', done => {
        const statusUpdates = [];
        const callback = (status) => {
            statusUpdates.push(status);
            // After both events have been triggered, verify results
            if (statusUpdates.length === 2) {
                expect(statusUpdates).toEqual([true, false]);
                done();
            }
        };

        startCallDetection(callback);
    });

    test('stopCallDetection calls dispose on callDetector', () => {
        startCallDetection(() => { });

        stopCallDetection();

        expect(mockDispose).toHaveBeenCalledTimes(1);
    });

    test('stopCallDetection does nothing if callDetector is null', () => {
        // Manually set callDetector to null
        stopCallDetection();
        // Just make sure no errors thrown, no calls to dispose
        expect(mockDispose).not.toHaveBeenCalled();
    });
});
