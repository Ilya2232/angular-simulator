import { Component, OnInit, OnDestroy } from '@angular/core';
import './training';
import { IService } from '../interfaces/IService';
import { FormsModule } from '@angular/forms';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { MessageService } from './services/message.service';
import { MessageType } from '../enums/message-type.enum';
import { StorageService } from '../interfaces/localStorage.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule, NgClass, NgTemplateOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})

//2. Создать папку enums в папке src, в ней файл Color.ts, который экспортирует enum различных цветов (обязательно красный, зеленый, синий (RGB)). Создать метод внутри app.component, который проверяет, является ли переданный цвет основным, а основных у нас 3 цвета (красный, синий, зеленый) и возвращает нам true/false 
export class AppComponent {
  currentDateTime: string = '';
  selectedServiceId: number = 2;
  tourLocation: string = '';
  tourDate: string = '';
  tourParticipants: string = '';
  clickCount: number = 0;
  taskFour: boolean = true;
  inputValue: string = '';
  isLoading: boolean = true;
  clockIntervalId: any;

  services: IService[] = [
    {
      id: 1,
      title: 'Опытный гид',
      description: 'Для современного мира базовый вектор развития предполагает независимые способы реализации соответствующих условий активизации.',
      image: '/images/guide.png'
    },
    {
      id: 2,
      title: 'Безопасный поход',
      description: 'Для современного мира базовый вектор развития предполагает независимые способы реализации соответствующих условий активизации.',
      image: '/images/safe.png'
    },
    {
      id: 3,
      title: 'Лояльные цены',
      description: 'Для современного мира базовый вектор развития предполагает независимые способы реализации соответствующих условий активизации.',
      image: '/images/price.png'
    }
  ]

  constructor(public messageService: MessageService, private storageService: StorageService) {
    this.saveLastVisit();
    this.saveNumberOfVisits();
    this.startClock();
  }

  public onProgramTourClick(): void {
    this.messageService.addMessage('Программа недоступна', MessageType.WARN);
  }

  public onProgramPriceClick(): void {
    this.messageService.addMessage('Стоимость отправлена на почту', MessageType.INFO);
  }

  public onRatingButtonClick(): void {
    this.messageService.addMessage('Направления получены', MessageType.SUCCESS);
  }

  public onOtherStuffClick(): void {
    this.messageService.addMessage('Материалы недоступны', MessageType.ERROR);
  }

  //3. Далее создать метод, которая сохраняет в локальное хранилище дату последнего захода на страницу. Вызывать ее в конструкторе.
  private saveLastVisit(): void {
    const date = new Date().toString();
    this.storageService.setItem<string>('lastVisit', date);
  }

  //4. Далее создать метод, которая сохраняет в localStorage количество заходов на страницу.  Вызывать ее в конструкторе.
  private saveNumberOfVisits(): void {
    const visits = this.storageService.getItem<number>('visits') || 0;
    this.storageService.setItem<number>('visits', visits + 1);
  }

  public selectService(serviceId: number): void {
    this.selectedServiceId = serviceId;
  }

  private startClock(): void {
    this.currentDateTime = new Date().toLocaleString('ru-RU');

    this.clockIntervalId = setInterval(() => {
      this.currentDateTime = new Date().toLocaleString('ru-RU');
    }, 1000)
  }

  public increment() {
    this.clickCount += 1;
  }

  public decrement() {
    if (this.clickCount > 0) {
      this.clickCount -= 1;
    }
  }

  public toggleTask() {
    this.taskFour = !this.taskFour;
  }

  public ngOnInit() {
    this.startClock();

    setTimeout(() => {
      this.isLoading = false;
    }, 2000)
  }

  public ngOnDestroy() {
    if (this.clockIntervalId) {
      clearInterval(this.clockIntervalId);
    }
  }
}


