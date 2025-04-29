import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat'
})

export class PhonePipe implements PipeTransform {
  transform(num: string): any { // format a phone number correctly
    num = num?.replace(/\D+/g, ''); // remove all non-numerical characters
    return num;
  }
}
