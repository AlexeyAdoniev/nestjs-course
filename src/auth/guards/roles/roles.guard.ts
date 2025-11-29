import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../roles/enums/role.enum';
import { ROLES_KEY } from '../../decorators/roles.decorator';
import { Request } from 'express';
import { RequestUser } from '../../interfaces/request-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const user = request.user as RequestUser;

    if (user.role === Role.ADMIN) return true;

    return requiredRoles.includes(user.role);
  }
}
