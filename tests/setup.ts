process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';

jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'info').mockImplementation(() => {});
