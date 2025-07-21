import { AddUserAgentInterceptor } from './user.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('AddUserAgentInterceptor', () => {
  let interceptor: AddUserAgentInterceptor;

  beforeEach(() => {
    interceptor = new AddUserAgentInterceptor();
  });

  it('should add useragent header to the response', (done) => {
  
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { 'user-agent': 'test-agent' },
        }),
      }),
    } as unknown as ExecutionContext;

    const mockCallHandler: CallHandler = {
      handle: () => of({ message: 'hello' }),
    };

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: (result) => {
        expect(result).toEqual({
          message: 'hello',
          userAgent: 'test-agent',
        });
        done();
      },
      error: done.fail,
    });
  });

  it('should add userAgent as unknown if header missing', (done) => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    } as unknown as ExecutionContext;

    const mockCallHandler: CallHandler = {
      handle: () => of({ foo: 'bar' }),
    };

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: (result) => {
        expect(result).toEqual({
          foo: 'bar',
          userAgent: 'unknown',
        });
        done();
      },
      error: done.fail,
    });
  });
});
