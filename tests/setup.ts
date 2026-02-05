// Global test setup
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';

// Silence console during tests
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'info').mockImplementation(() => {});
