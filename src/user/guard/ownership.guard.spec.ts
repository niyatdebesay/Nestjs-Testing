import { UserIdMatchGuard } from './ownership.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';

describe('UserIdMatchGuard', () => {
  let guard: UserIdMatchGuard;

  beforeEach(() => {
    guard = new UserIdMatchGuard();
  });

  function createMockExecutionContext(userId: string | null, paramId: string) {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user: userId ? { id: userId } : undefined,
          params: { id: paramId },
        }),
      }),
    } as unknown as ExecutionContext;
  }

  it('should allow access if user id matches param id', () => {
    const context = createMockExecutionContext('123', '123');
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException if user is not authenticated', () => {
    const context = createMockExecutionContext(null, '123');
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException if user id does not match param id', () => {
    const context = createMockExecutionContext('123', '456');
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
