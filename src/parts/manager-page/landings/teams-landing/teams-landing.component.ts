import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  Brigade,
  Workman,
  BrigadeUpdatePayload,
} from '@/shared/interfaces/brigade.interface';
import { BrigadeService } from '@/shared/services/brigade.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teams-landing',
  standalone: true,
  imports: [DragDropModule, CommonModule],
  templateUrl: './teams-landing.component.html',
  styleUrl: './teams-landing.component.scss',
})
export class TeamsLandingComponent implements OnInit {
  brigades: Brigade[] = [];
  freeWorkers: Workman[] = [];

  constructor(private brigadeService: BrigadeService) {}

  ngOnInit(): void {
    this.loadBrigades();
    this.loadFreeWorkers();
  }

  loadBrigades(): void {
    this.brigadeService.getAllBrigades().subscribe({
      next: (data: any) => {
        this.brigades = data.map((b: any) => ({
          brigadier_id: b.brigadier_id,
          title: `Бригада №${b.brigadier_id} (${b.brigadier_surname} ${b.brigadier_name} ${b.brigadier_patronymic})`,
          workmen: b.workers.map((w: any) => ({
            id: w.workman_id,
            name: w.workman_name,
            surname: w.workman_surname,
            patronymic: w.workman_patronymic,
          })),
        }));
      },
      error: (err) => console.error('Ошибка при загрузке бригад', err),
    });
  }

  loadFreeWorkers(): void {
    this.brigadeService.freeBrigade().subscribe({
      next: (data: any) => {
        this.freeWorkers = data.map((w: any) => ({
          id: w.id,
          name: w.name,
          surname: w.surname,
          patronymic: w.patronymic,
        }));
      },
      error: (err) =>
        console.error('Ошибка при загрузке свободных работников', err),
    });
  }

  drop(event: CdkDragDrop<Workman[]>, targetBrigadierId: number | null) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.syncBrigadesWithServer();
    }
  }

  syncBrigadesWithServer(): void {
    const brigadsPayload = this.brigades.map((brigade) => ({
      brigadier_id: brigade.brigadier_id,
      workman_ids: brigade.workmen.map((w) => w.id),
    }));

    this.brigadeService.editBrigade({ brigads: brigadsPayload }).subscribe({
      next: () => {
        console.log('Успешно синхронизировано');
        this.loadFreeWorkers();
      },
      error: (err) => console.error('Ошибка при синхронизации', err),
    });
  }
}
