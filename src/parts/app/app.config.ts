import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: 'white',
          cssLayer: false,
        },
      },
      translation: {
        accept: 'Принять',
        reject: 'Отклонить',
        pending: 'В ожидании',
        fileSizeTypes: ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ', 'ЭБ', 'ЗБ', 'ЙБ'],
        dayNames: [
          'Воскресенье',
          'Понедельник',
          'Вторник',
          'Среда',
          'Четверг',
          'Пятница',
          'Суббота',
        ],
        dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        monthNames: [
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
        ],
        monthNamesShort: [
          'Янв',
          'Фев',
          'Мар',
          'Апр',
          'Май',
          'Июн',
          'Июл',
          'Авг',
          'Сен',
          'Окт',
          'Ноя',
          'Дек',
        ],
        chooseYear: 'Выберите год',
        chooseMonth: 'Выберите месяц',
        chooseDate: 'Выберите дату',
        prevDecade: 'Предыдущее десятилетие',
        nextDecade: 'Следующее десятилетие',
        prevYear: 'Предыдущий год',
        nextYear: 'Следующий год',
        prevMonth: 'Предыдущий месяц',
        nextMonth: 'Следующий месяц',
        today: 'Сегодня',
        clear: 'Очистить',
        weekHeader: 'Нед',
        firstDayOfWeek: 1, // понедельник
        dateFormat: 'dd.mm.yy',
      },
    }),
  ],
};
