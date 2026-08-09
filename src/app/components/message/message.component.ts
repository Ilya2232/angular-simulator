import { Component } from '@angular/core';
import { NgTemplateOutlet, NgClass } from '@angular/common';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-message',
  imports: [NgTemplateOutlet, NgClass],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  constructor(public messageService: MessageService) { }
}
