import { Directive, ElementRef, EventEmitter, Host, HostListener, Output, SimpleChanges } from '@angular/core';

import { GlobalService } from './global.service';

@Directive({
  selector: '[appPhoneSyntaxHighlighter]'
})
export class PhoneHighlighterDirective {

  constructor(private displayPhone: ElementRef, private globalService: GlobalService) {}

  @HostListener('keydown', ['$event']) // listen to keydown strokes in this input
  onKeyDown(event: KeyboardEvent) {
    const value: string = this.displayPhone.nativeElement.value + event.key;
    if (!value.match(this.globalService.phoneRegex)) { // if we do not match proper email regex, highlight!
      this.displayPhone.nativeElement.setAttribute('style', 'color: rgb(239 68 68);');
    } else {
      this.displayPhone.nativeElement.removeAttribute('style', 'color: rgb(239 68 68);');
    }
  }

}


@Directive({
  selector: '[appEmailSyntaxHighlighter]'
})
export class EmailHighlighterDirective { // highlight incorrectly formatted emails

  constructor(private displayEmail: ElementRef, private globalService: GlobalService) {}

  @HostListener('keydown', ['$event']) // listen to keydown strokes in this input
  onKeyDown(event: KeyboardEvent) {
    const value: string = this.displayEmail.nativeElement.value + event.key;
    if (!value.match(this.globalService.emailRegex)) { // if we do not match proper email regex, highlight!
      this.displayEmail.nativeElement.setAttribute('style', 'color: rgb(239 68 68);');
    } else {
      this.displayEmail.nativeElement.removeAttribute('style', 'color: rgb(239 68 68);');
    }
  }


}

@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(target: any) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}
