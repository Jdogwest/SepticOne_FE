import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@/shared/services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate() {
    return this.authService.getSessionData().pipe(
      take(1),
      map((session) => {
        if (
          session?.user?.role === 'admin' ||
          session?.user?.role === 'manager'
        ) {
          return true;
        } else {
          this.router.navigate(['']);
          return false;
        }
      })
    );
  }
}
