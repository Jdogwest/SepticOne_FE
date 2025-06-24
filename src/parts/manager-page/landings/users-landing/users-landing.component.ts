import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from '@/shared/services/users.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@/shared/services/auth.service';
import { NotificationService } from '@/shared/services/notification.service';

@Component({
  selector: 'app-users-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './users-landing.component.html',
  styleUrls: ['./users-landing.component.scss'],
})
export class UsersLandingComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  currentRole: string = '';
  roleToLabel: Record<string, string> = {
    admin: 'Администратор',
    manager: 'Менеджер',
    client: 'Клиент',
    workman: 'Рабочий',
    brigadier: 'Бригадир',
  };

  private readonly usersService = inject(UsersService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.authService.getSessionData().subscribe({
      next: (user: any) => {
        this.currentRole = user?.user?.role ?? '';
        this.loadUsers();
      },
      error: (err: any) => {
        // this.notificationService.error(
        //   `Ошибка при получении текущего пользователя: ${
        //     err?.error?.detail || 'Неизвестная ошибка'
        //   }`
        // );
        console.error(err);
      },
    });
  }

  private loadUsers(): void {
    const request$ =
      this.currentRole === 'admin'
        ? this.usersService.getAllUsers()
        : this.currentRole === 'manager'
        ? this.usersService.getAllClients()
        : null;
    if (!request$) {
      this.users = [];
      return;
    }

    request$.subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.users = data;
        } else {
          // this.notificationService.error(`Ошибка: ${data}`);
          console.error(data);
          this.users = [];
        }
      },
      error: (err) => {
        // this.notificationService.error(
        //   `Ошибка при получении пользователей: ${
        //     err?.error?.detail || 'Неизвестная ошибка'
        //   }`
        // );
        console.error(err);
      },
    });
  }
}
