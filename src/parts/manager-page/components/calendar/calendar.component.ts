import { BusyDateResponse } from '@/manager-page/interfaces/brigade-status.interface';
import { BrigadeService } from '@/shared/services/brigade.service';
import { Component, inject, OnInit } from '@angular/core';
import { Day } from '@/manager-page/interfaces/calendar.interface';
import { RouterLink } from '@angular/router';
import { NotificationService } from '@/shared/services/notification.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [RouterLink],
})
export class CalendarComponent implements OnInit {
  year!: number;
  month!: number;
  calendarDays: Day[][] = [];
  private readonly brigadeService = inject(BrigadeService);
  private readonly notificationService = inject(NotificationService);

  months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];

  ngOnInit() {
    const today = new Date();
    this.year = today.getFullYear();
    this.month = today.getMonth();

    this.generateCalendar(this.year, this.month);
    this.loadBrigadsSchedule();
  }

  generateCalendar(year: number, month: number) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstWeekday = firstDay.getDay() || 7;
    const daysInMonth = lastDay.getDate();

    const weeks: Day[][] = [];
    let currentWeek: Day[] = [];

    for (let i = 1; i < firstWeekday; i++) {
      currentWeek.push({ date: null });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push({ date: new Date(year, month, day) });
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push({ date: null });
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    this.calendarDays = weeks;
  }

  loadBrigadsSchedule() {
    this.brigadeService.getBrigadeBusyDate().subscribe({
      next: (busyDatesResponse) => {
        const busyDatesMap = new Map<
          string,
          BusyDateResponse['busy_brigadiers']
        >();

        busyDatesResponse.forEach((entry) => {
          busyDatesMap.set(entry.date, entry.busy_brigadiers);
        });

        this.calendarDays.forEach((week) => {
          week.forEach((day) => {
            if (day.date) {
              const isoDate = day.date.toISOString().slice(0, 10);
              const brigadiers = busyDatesMap.get(isoDate);
              if (brigadiers) {
                day.busy = true;
                day.brigadsStatus = brigadiers.map((b) => ({
                  request_id: b.request_id,
                  brigadId: b.id,
                  brigadSurname: b.surname,
                  brigadName: b.name,
                  brigadPatronymic: b.patronymic,
                  busyTimes: [],
                }));
              } else {
                day.busy = false;
                day.brigadsStatus = [];
              }
            }
          });
        });
      },
      error: (err) => {
        this.notificationService.error(
          `Ошибка загрузки занятых дат: ${
            err?.error?.detail || 'Неизвестная ошибка'
          }`
        );
      },
    });
  }
}
