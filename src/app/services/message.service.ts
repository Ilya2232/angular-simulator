import { Injectable } from '@angular/core';
import { IMessage } from '../../interfaces/IService';
import { MessageType } from '../../enums/message-type.enum';
import { StorageService } from '../../interfaces/localStorage.service';

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  private _messages: IMessage[] = [];
  private readonly STORAGE_KEY = 'active-notifications';

  constructor(private storageService: StorageService) {
    this._messages = storageService.getItem<IMessage[]>(this.STORAGE_KEY) || [];
    this._messages.forEach(msg => this.startDestroyerTimer(msg.id));
  }

  public get messages(): readonly IMessage[] {
    return [...this._messages];
  }

  public showWarn(text: string): void {
    this.addMessage(text, MessageType.WARN);
  }

  public showInfo(text: string): void {
    this.addMessage(text, MessageType.INFO);
  }

  public showSuccess(text: string): void {
    this.addMessage(text, MessageType.SUCCESS);
  }

  public showError(text: string): void {
    this.addMessage(text, MessageType.ERROR);
  }

  private addMessage(text: string, type: MessageType): void {
    const id = Date.now();
    const newMessage: IMessage = {
      id: id,
      text: text,
      type: type
    }
    this._messages.unshift(newMessage);
    this.saveToStorage();
    this.startDestroyerTimer(id);
  }

  public closeMessage(id: number) {
    this._messages = this._messages.filter(msg => msg.id !== id);
    this.saveToStorage();
  }

  private saveToStorage(): void {
    this.storageService.setItem<IMessage[]>(this.STORAGE_KEY, this._messages);
  }

  private startDestroyerTimer(id: number): void {
    setTimeout(() => {
      this.closeMessage(id);
    }, 5000)
  }
}