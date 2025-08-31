import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import * as JsonWebTokenUtil from '../jsonwebtoken/JsonWebTokenUtil';
import { Config } from '../../config';
import ms, { StringValue } from 'ms';

// Mock JsonWebTokenUtil
jest.mock('../jsonwebtoken/JsonWebTokenUtil');
jest.mock('../../config');

const realJwtSign = jest.requireActual(
  '../jsonwebtoken/JsonWebTokenUtil',
).jwtSign;
const realJwtVerify = jest.requireActual(
  '../jsonwebtoken/JsonWebTokenUtil',
).jwtVerify;

describe('JwtService', () => {
  let jwtService: JwtService;
  let mockJwtSign: jest.MockedFunction<typeof JsonWebTokenUtil.jwtSign>;
  let mockJwtVerify: jest.MockedFunction<typeof JsonWebTokenUtil.jwtVerify>;

  beforeEach(async () => {
    // Reset all mocks
    jest.clearAllMocks();

    mockJwtSign = JsonWebTokenUtil.jwtSign as jest.MockedFunction<
      typeof JsonWebTokenUtil.jwtSign
    >;
    mockJwtVerify = JsonWebTokenUtil.jwtVerify as jest.MockedFunction<
      typeof JsonWebTokenUtil.jwtVerify
    >;

    // Mock Config
    (Config as any).jwt = {
      privateKey: 'test-private-key',
      defaultTtl: '10m',
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtService],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createJwtToken', () => {
    it('should use correct expiredAt as Date', async () => {
      mockJwtSign.mockImplementation(realJwtSign);
      mockJwtVerify.mockImplementation(realJwtVerify);

      const periodInSec = 60;
      const now = Date.now();
      const expectedTime = now + periodInSec * 1000;
      const token = await jwtService.createJwtToken(
        {},
        {
          expiresIn: periodInSec,
        },
      );

      const result = await jwtService.parseJwtToken(token);
      expect(result).toBeDefined();

      const realTime = result!.exp! * 1000;
      expect(Math.abs(realTime - expectedTime)).toBeLessThan(1000);
    });

    it('should use correct expiredAt as string', async () => {
      mockJwtSign.mockImplementation(realJwtSign);
      mockJwtVerify.mockImplementation(realJwtVerify);

      const period = '7d';
      const now = Date.now();
      const expectedTime = now + ms(period);
      const token = await jwtService.createJwtToken(
        {},
        {
          expiresIn: period,
        },
      );

      const result = await jwtService.parseJwtToken(token);
      expect(result).toBeDefined();

      const realTime = result!.exp! * 1000;
      expect(Math.abs(realTime - expectedTime)).toBeLessThan(1000);
    });

    it('should create JWT token with default options successfully', async () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const expectedToken = 'jwt.token.here';
      const expectedOptions = {
        subject: 'auth',
        issuer: 'p2ex',
        expiresIn: '10m',
      };

      mockJwtSign.mockResolvedValue(expectedToken);

      const result = await jwtService.createJwtToken(payload);

      expect(mockJwtSign).toHaveBeenCalledWith(
        payload,
        'test-private-key',
        expectedOptions,
      );
      expect(result).toBe(expectedToken);
    });

    it('should create JWT token with custom options successfully', async () => {
      const payload = { userId: '456', role: 'admin' };
      const customOptions = {
        subject: 'custom-auth',
        issuer: 'custom-api',
        expiresIn: '1h' as StringValue,
        audience: 'test-audience',
      };
      const expectedToken = 'custom.jwt.token';

      mockJwtSign.mockResolvedValue(expectedToken);

      const result = await jwtService.createJwtToken(payload, customOptions);

      expect(mockJwtSign).toHaveBeenCalledWith(
        payload,
        'test-private-key',
        customOptions,
      );
      expect(result).toBe(expectedToken);
    });

    it('should merge custom options with defaults', async () => {
      const payload = { userId: '789' };
      const partialOptions = {
        expiresIn: '2h' as StringValue,
      };
      const expectedOptions = {
        subject: 'auth',
        issuer: 'p2ex',
        expiresIn: '2h' as StringValue,
      };
      const expectedToken = 'merged.jwt.token';

      mockJwtSign.mockResolvedValue(expectedToken);

      const result = await jwtService.createJwtToken(payload, partialOptions);

      expect(mockJwtSign).toHaveBeenCalledWith(
        payload,
        'test-private-key',
        expectedOptions,
      );
      expect(result).toBe(expectedToken);
    });

    it('should handle jwtSign errors', async () => {
      const payload = { userId: '123' };
      const error = new Error('Signing failed');

      mockJwtSign.mockRejectedValue(error);

      await expect(jwtService.createJwtToken(payload)).rejects.toThrow(
        'Signing failed',
      );
    });
  });

  describe('parseJwtToken', () => {
    it('should verify and parse JWT token string successfully', async () => {
      const tokenString = 'valid.jwt.token';
      const expectedPayload = { userId: '456', email: 'user@example.com' };

      mockJwtVerify.mockResolvedValue(expectedPayload);

      const result =
        await jwtService.parseJwtToken<typeof expectedPayload>(tokenString);

      expect(mockJwtVerify).toHaveBeenCalledWith(
        tokenString,
        'test-private-key',
      );
      expect(result).toEqual(expectedPayload);
    });

    it('should return undefined when JWT verification fails with known error', async () => {
      const tokenString = 'invalid.jwt.token';
      const error = new Error('Token expired');
      error.name = 'TokenExpiredError';

      mockJwtVerify.mockRejectedValue(error);

      const result = await jwtService.parseJwtToken(tokenString);

      expect(mockJwtVerify).toHaveBeenCalledWith(
        tokenString,
        'test-private-key',
      );
      expect(result).toBeUndefined();
    });

    it('should handle empty string token', async () => {
      const tokenString = '';
      const error = new Error('Invalid token');
      error.name = 'JsonWebTokenError';

      mockJwtVerify.mockRejectedValue(error);

      const result = await jwtService.parseJwtToken(tokenString);

      expect(result).toBeUndefined();
    });

    it('should return typed result when type is specified', async () => {
      interface CustomPayload {
        id: string;
        role: string;
      }

      const tokenString = 'typed.jwt.token';
      const expectedPayload: CustomPayload = { id: '123', role: 'admin' };

      mockJwtVerify.mockResolvedValue(expectedPayload);

      const result = await jwtService.parseJwtToken<CustomPayload>(tokenString);

      expect(result).toEqual(expectedPayload);
      expect(typeof result?.id).toBe('string');
      expect(typeof result?.role).toBe('string');
    });
  });
});
