import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // 1. Look for the 'token' safe inside the cookies
    const token = request.cookies?.token;

    if (!token) {
      throw new UnauthorizedException('Authentication required. Please log in.');
    }

    try {
      // 2. Crack the safe open using your secret key
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      // 3. Attach the user data to the request so the controller can use it
      request.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    // 4. Open the door
    return true; 
  }
}