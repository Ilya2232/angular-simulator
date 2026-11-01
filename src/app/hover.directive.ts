import { Directive, ElementRef, HostBinding, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appHover]',
  standalone: true,
})
export class HoverDirective {
  private el = inject(ElementRef);

  @HostBinding('style.font-weight') fontWeight = 'normal';

  @HostListener('mouseenter')
  onEnter() {
    this.fontWeight = 'bold';
  }

  @HostListener('mouseleave')
  onLeave() {
    this.fontWeight = 'normal';
  }
}
