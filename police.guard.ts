// // police.guard.ts
// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { Request } from 'express';
// import { Role } from '../user/role.enum';

// @Injectable()
// export class PoliceGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const request = context.switchToHttp().getRequest<Request>();
//     const user = request.user;
//     return user && user.role === Role.POLICE;
//   }
// }
