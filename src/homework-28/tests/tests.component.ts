import { ChangeDetectionStrategy, Component, DoCheck, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrl: './tests.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class TestsComponent implements DoCheck {
  private http = inject(HttpClient);

  count = 0;

  ngDoCheck() {
    console.warn('Change Detection');
  }

  onClick() {
    this.count++;
  }

  onTimeout() {
    setTimeout(() => {
      this.count++;
    }, 1000);
  }

  onPromise() {
    Promise.resolve().then(() => {
      this.count++;
    });
  }

  onHttp() {
    this.http.get('https://jsonplaceholder.typicode.com/users').subscribe();
  }

  startInterval() {
    setInterval(() => {
      this.count++;
    }, 1000);
  }

  onCombined() {
    this.count++;

    setTimeout(() => {
      console.warn('setTimeout');
      this.count++;
    }, 1000);

    Promise.resolve().then(() => {
      console.warn('Promise');
      this.count++;
    });
  }
}

/* 
Сценарий 1 (click): интерфейс обновился автоматически; ngDoCheck выполнился 1 раз; ChangeDetectorRef не понадобился; причина запуска: событие click.
Сценарий 2 (setTimeout): интерфейс обновился автоматически; ngDoCheck выполнился 2 раза; ChangeDetectorRef не понадобился; причина запуска: событие click, затем срабатывание таймера.
Сценарий 3 (Promise): интерфейс обновился автоматически; ngDoCheck выполнился 1 раз; ChangeDetectorRef не понадобился; причина запуска: событие click, при этом проверка ждёт завершения микрозадачи Promise.
Сценарий 4 (HttpClient): интерфейс обновился автоматически; ngDoCheck выполнился 2; ChangeDetectorRef не понадобился; причина запуска: событие click, затем асинхронные события HTTP-запроса.
Сценарий 5 (setInterval): интерфейс обновлялся автоматически каждую секунду; ngDoCheck выполнился 1 раз за click и по 1 разу за каждый тик таймера; ChangeDetectorRef не понадобился; причина запуска: событие click, затем каждый тик таймера.
Сценарий 6 (все сразу): интерфейс обновился автоматически; ngDoCheck обычно выполнялся 2 раза; ChangeDetectorRef не понадобился; причина запуска: событие click вместе с Promise, затем срабатывание таймера.
*/
