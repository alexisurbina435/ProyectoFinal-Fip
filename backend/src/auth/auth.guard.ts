import { ExecutionContext, Injectable } from "@nestjs/common";
import { CanActivate } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {

        const request = context.switchToHttp().getRequest();
        const token = request.cookies?.token;

        if (!token) {
            return false;
        }
        try {
            const usuario = this.jwtService.verify(token);
            request['usuario'] = usuario;
           
            return true;
        } catch (error) {
            
            return false;
        }
    }
}