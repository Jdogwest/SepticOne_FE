import { AuthService } from '@/shared/services/auth.service';
import { NotificationService } from '@/shared/services/notification.service';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '@/shared/services/users.service';
import { User } from '@/shared/interfaces/user.interface';

@Component({
  selector: 'app-sidebar-landing',
  imports: [RouterLink],
  templateUrl: './sidebar-landing.component.html',
  styleUrl: './sidebar-landing.component.scss',
})
export class SidebarLandingComponent {
  private readonly authService = inject(AuthService);

  private readonly notificationService = inject(NotificationService);

  private readonly router = inject(Router);

  user: User | null = null;

  roleMap: Record<string, string> = {
    client: 'Клиент',
    manager: 'Менеджер',
    workman: 'Рабочий',
    admin: 'Администратор',
  };

  ngOnInit(): void {
    this.authService.getSessionData().subscribe({
      next: (session) => {
        this.user = session?.user || null;
      },
      error: (err) => {
        // this.notificationService.error(
        //   `Ошибка получения данных сессии: ${
        //     err?.error?.detail || 'Неизвестная ошибка'
        //   }`
        // );
        console.error(err);
      },
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: (res: any) => {
        this.notificationService.success('Выход выполнен успешно');
        this.router.navigate(['']);
      },
      error: (err) => {
        // this.notificationService.error(
        //   `Ошибка выхода: ${err?.error?.detail || 'Неизвестная ошибка'}`
        // );
        console.error(err);
      },
    });
  }
}
