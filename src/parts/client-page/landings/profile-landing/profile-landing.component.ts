import { Component, inject, DestroyRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserFormComponent } from '@/main-page/forms/user-form/user-form.component';
import { AddressFormComponent } from '@/main-page/forms/address-form/address-form.component';
import { AuthService } from '@/shared/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { signal } from '@angular/core';
import { RequestsService } from '@/shared/services/requests.service';
import { RequestsListComponent } from '@/main-page/components/requests-list/requests-list.component';
import { MyRequest } from '@/shared/interfaces/my-request.interface';

@Component({
  selector: 'app-profile-landing',
  standalone: true,
  imports: [UserFormComponent, AddressFormComponent, RequestsListComponent],
  templateUrl: './profile-landing.component.html',
  styleUrl: './profile-landing.component.scss',
})
export class ProfileLandingComponent implements OnInit {
  requests: MyRequest[] = [];
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly requestsService = inject(RequestsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoggedIn = signal(false);

  ngOnInit() {
    this.authService.checkAuth();

    this.authService.isLoggedIn$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((loggedIn) => {
        this.isLoggedIn.set(loggedIn);

        if (!loggedIn) {
          this.router.navigate(['']);
        }
      });

    this.loadMyRequests();
  }

  private loadMyRequests() {
    this.requestsService.getMyRequests().subscribe((requests) => {
      this.requests = requests as MyRequest[];
    });
  }
}
