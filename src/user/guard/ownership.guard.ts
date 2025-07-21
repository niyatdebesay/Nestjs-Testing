import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class UserIdMatchGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const loggedInUserId = request.user?.id;
    const paramId = request.params.id;

    if (!loggedInUserId) {
      throw new ForbiddenException('User not authenticated');
    }

    if (loggedInUserId !== paramId) {
      throw new ForbiddenException('You can only access your own data');
    }

    return true;
  }
}
