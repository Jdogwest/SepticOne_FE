import { Routes } from '@angular/router';
import { LandingLayoutComponent } from '@/main-page/landing-layout/landing-layout.component';
import { MainLandingComponent } from '@/main-page/landings/main-landing/main-landing.component';
import { ProfileLandingComponent } from '@/main-page/landings/profile-landing/profile-landing.component';
import { CreateApplicationsLandingComponent } from '@/main-page/landings/create-applications-landing/create-applications-landing.component';
import { RequestsLandingComponent } from '@/manager-page/landings/requests-landing/requests-landing.component';
import { RequestEditComponent } from '@/manager-page/landings/request-edit/request-edit.component';
import { TeamsLandingComponent } from '@/manager-page/landings/teams-landing/teams-landing.component';
import { UsersLandingComponent } from '@/manager-page/landings/users-landing/users-landing.component';
import { AdminLayoutComponent } from '@/manager-page/admin-layout/admin-layout.component';
import { UserEditComponent } from '@/manager-page/landings/user-edit/user-edit.component';
import { AdminGuard } from '@/guards/admin.guard';
import { CallRequestsLandingComponent } from '@/manager-page/landings/call-requests-landing/call-requests-landing.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingLayoutComponent,
    children: [
      {
        path: '',
        component: MainLandingComponent,
      },
      {
        path: 'profile',
        component: ProfileLandingComponent,
      },
      {
        path: 'create-application',
        component: CreateApplicationsLandingComponent,
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    component: AdminLayoutComponent,
    children: [
      {
        path: 'requests',
        component: RequestsLandingComponent,
      },
      {
        path: 'users',
        component: UsersLandingComponent,
      },
      {
        path: 'teams',
        component: TeamsLandingComponent,
      },
      {
        path: 'request-edit/:id',
        component: RequestEditComponent,
      },
      {
        path: 'user-edit/:id',
        component: UserEditComponent,
      },
      {
        path: 'call-requests',
        component: CallRequestsLandingComponent,
      },
    ],
  },
];
