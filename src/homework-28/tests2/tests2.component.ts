import {
  Component,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  DoCheck,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tests2',
  imports: [],
  templateUrl: './tests2.component.html',
  styleUrl: './tests2.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tests2Component implements DoCheck {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  count = 0;

  ngDoCheck() {
    console.warn('ngDoCheck');
  }

  onClickReattach() {
    this.count++;
    this.cdr.reattach();
  }
  /*
Что изменилось после reattach()?
Angular снова начнет учитывать его в следующих циклах cd
Когда компонент снова начал участвовать в Change Detection?
Сразу после вызова reattach() он снова подключён к дереву
Нужно ли дополнительно вызывать detectChanges() или markForCheck()?
после асинхронных изменений всё ещё нужен markForCheck(), потому что reattach() не отменяет правила этой стратегии. detectChanges() нужен, только если интерфейс надо обновить немедленно
  */

  onClick() {
    this.count++;
    this.cdr.detach();
  }
  /*
Обновляется ли интерфейс?
Нет
Выполняется ли ngDoCheck()?
Да
Почему Angular перестал проверять компонент?
detach() отсоединил представление компонента от дерева Change Detection. Циклы проверки продолжают запускаться, но Angular пропускает этот компонент
Какие способы изменения значения больше не работают?
Значение count продолжает меняться всеми способами: через click, setTimeout, setInterval и Promise. Но ни один из них больше не обновляет интерфейс автоматически. Обновить его можно вручную через detectChanges()
*/

  onTimeout() {
    setTimeout(() => {
      this.count++;
      this.cdr.markForCheck();
    }, 1000);
  }
  /*
Что произошло после вызова markForCheck()?
Ответ:После вызова он помечает компонент, что во время следующего цикла cd обязательно проверь компонент
Обновился ли интерфейс сразу?
Нет
Когда фактически произошел Change Detection?
Он происходит после завершения асинхронной задачи, в данном случае колбэка setTimeout
Почему без markForCheck() интерфейс не обновлялся?
Cd запускался, но Angular пропускал компонент с OnPush, потому что тот не был помечен для проверки.
*/

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

  onTimeoutDetect() {
    setTimeout(() => {
      this.count++;
      this.cdr.detectChanges();
    }, 1000);
  }
  /*
  Чем поведение отличается от предыдущего сценария?
  Ответ: cd выполняется немедленно
  Выполняется ли Change Detection немедленно?
  Ответ: да
  Какие компоненты были проверены?
  текущий компонент и его дочерние компоненты, но не родители.
  В каких случаях использование detectChanges() предпочтительнее?
  Когда нам надо обновить интерфейс прямо сейчас
  */

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
