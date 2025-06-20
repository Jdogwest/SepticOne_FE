import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotificationComponent } from 'src/shared/components/notification/notification.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'clearing-stations';
}
