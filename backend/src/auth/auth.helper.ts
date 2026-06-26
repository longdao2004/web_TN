import { UnauthorizedException } from '@nestjs/common';

/**
 * Checks if the request contains a authenticated user with one of the allowed roles.
 * Throws an UnauthorizedException if the user is missing or doesn't have an allowed role.
 * 
 * @param req The NestJS request object (usually annotated with @Req())
 * @param allowedRoles Array of strings containing roles that are allowed
 */
export function checkRole(req: any, allowedRoles: string[]): void {
  if (!req || !req.user || !req.user.role || !allowedRoles.includes(req.user.role)) {
    throw new UnauthorizedException('Access denied: Insufficient permissions.');
  }
}
