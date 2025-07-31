import CallDetectorManager from 'react-native-call-detection';

let callDetector = null;

export function startCallDetection(setStatusCallback) {
    callDetector = new CallDetectorManager(
        (event) => {
            if (event === 'Connected' || event === 'Incoming') {
                setStatusCallback(true);
            } else {
                setStatusCallback(false);
            }
        },
        true,
        () => { },
        {
            title: 'Phone State Permission',
            message: 'This app needs access to your phone state for call detection.',
        }
    );
}

export function stopCallDetection() {
    if (callDetector) {
        callDetector.dispose();
    }
}
