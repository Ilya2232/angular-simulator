import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IService } from '../../../interfaces/IService';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  messageService = inject(MessageService);

  selectedServiceId = 2;
  tourLocation = '';
  tourDate = '';
  tourParticipants = '';
  inputValue = '';

  services: IService[] = [
    {
      id: 1,
      title: 'Опытный гид',
      description:
        'Для современного мира базовый вектор развития предполагает независимые способы реализации соответствующих условий активизации.',
      image: '/images/guide.png',
    },
    {
      id: 2,
      title: 'Безопасный поход',
      description:
        'Для современного мира базовый вектор развития предполагает независимые способы реализации соответствующих условий активизации.',
      image: '/images/safe.png',
    },
    {
      id: 3,
      title: 'Лояльные цены',
      description:
        'Для современного мира базовый вектор развития предполагает независимые способы реализации соответствующих условий активизации.',
      image: '/images/price.png',
    },
  ];

  onProgramTourClick(): void {
    this.messageService.showWarn('Программа недоступна');
  }

  onProgramPriceClick(): void {
    this.messageService.showInfo('Стоимость отправлена на почту');
  }

  onRatingButtonClick(): void {
    this.messageService.showSuccess('Направления получены');
  }

  onOtherStuffClick(): void {
    this.messageService.showError('Материалы недоступны');
  }

  selectService(serviceId: number): void {
    this.selectedServiceId = serviceId;
  }
}
