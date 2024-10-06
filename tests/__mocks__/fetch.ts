import fetch from 'node-fetch';

jest.mock('node-fetch', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({ data: 'mocked data' })
  }))
}));