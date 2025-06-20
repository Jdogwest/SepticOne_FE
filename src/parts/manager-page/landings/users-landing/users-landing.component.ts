import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from '@/shared/services/users.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@/shared/services/auth.service';

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

  private usersService = inject(UsersService);
  
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.getSessionData().subscribe({
      next: (user: any) => {
        this.currentRole = user?.user?.role ?? '';
        this.loadUsers();
      },
      error: (err: any) => {
        console.error('Ошибка при получении текущего пользователя', err);
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
          console.error('Ошибка:', data);
          this.users = [];
        }
      },
      error: (err) => {
        console.error('Ошибка при получении пользователей', err);
      },
    });
  }
}
