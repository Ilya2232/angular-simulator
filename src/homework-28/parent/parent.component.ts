import { Component } from '@angular/core';
import { ChildComponent } from '../child/child.component';

@Component({
  selector: 'app-parent',
  imports: [ChildComponent],
  templateUrl: './parent.component.html',
  styleUrl: './parent.component.scss',
})
export class ParentComponent {
  user = {
    name: 'Alex',
    age: 20,
  };

  changeName(): void {
    this.user = {
      ...this.user,
      name: 'Eugene',
    };
    //this.user.name = 'Eugene';
  }
}

/*
1.объяснить, почему интерфейс не обновился;
Ответ: потому что старая ссылка равна новой ссылке, следовательно CD считает что инпут не изменился, поэтому компонент с onPush() не будет проверен
*/
