import { AuthService } from '@/shared/services/auth.service';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { SidebarLandingComponent } from '../components/sidebar-landing/sidebar-landing.component';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterModule, SidebarLandingComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {}
