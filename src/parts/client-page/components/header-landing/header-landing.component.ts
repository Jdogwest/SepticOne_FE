import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  inject,
  signal,
  DestroyRef,
} from '@angular/core';
import { AuthService } from '@/shared/services/auth.service';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '@/shared/services/notification.service';

@Component({
  selector: 'app-header-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header-landing.component.html',
  styleUrl: './header-landing.component.scss',
})
export class HeaderLandingComponent implements OnInit {
  @Output() loginClick = new EventEmitter<void>();

  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isOpen = signal(false);
  protected readonly isLoggedIn = signal(false);

  ngOnInit(): void {
    this.authService.checkAuth();

    this.authService.isLoggedIn$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((loggedIn) => this.isLoggedIn.set(loggedIn));
  }

  toggleMenu(): void {
    this.isOpen.set(!this.isOpen());
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (res: any) => {
        this.notificationService.success(
          res?.detail || 'Выход выполнен успешно'
        );
      },
      error: (err) => {
        this.notificationService.error(err?.error?.detail || 'Ошибка выхода');
      },
    });
  }
}
