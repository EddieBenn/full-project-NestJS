import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PasswordOmitResponse implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        // Check if the data is an array of users
        if (Array.isArray(data)) {
          return data.map(userObj => this.omitPassword(userObj));
        }
        // If it's a single user object
        return this.omitPassword(data);
      }),
    );
  }

  // Helper method to omit the password field
  private omitPassword(userObj: any) {
    const { password, ...userWithoutPassword } = userObj;
    return userWithoutPassword;
  }
}
