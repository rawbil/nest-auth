import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRole } from "generated/prisma";


@Injectable()
export class AdminGuard implements CanActivate {
   canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if(request.user?.role !== UserRole.ADMIN) {
        throw new UnauthorizedException("Unauthorized access");
    }
    return true;
   }
}