const CallDetectorManager = jest.fn().mockImplementation((callback) => {
    return {
        dispose: jest.fn(),
    };
});

export default CallDetectorManager;
