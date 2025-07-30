// __mocks__/react-navigation-native.js
export const useNavigation = () => ({
    setOptions: jest.fn(),
    navigate: jest.fn(),
    goBack: jest.fn(),
    // add other methods your tests use
});
