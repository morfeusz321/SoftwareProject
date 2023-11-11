import { ElementRef, Injectable } from '@angular/core';

declare var LeaderLine: any;
@Injectable({
  providedIn: 'root',
})
export class LeaderLineService {
  createLeaderLine(source: ElementRef, target: ElementRef): any {
    return new LeaderLine(source.nativeElement, target.nativeElement, {
      startPlug: 'square',
      endPlug: 'arrow',
      color: '#959da5',
    });
  }
}
