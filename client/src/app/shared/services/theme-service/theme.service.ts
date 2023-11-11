import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _accessibleMode = new Subject<boolean>();
  isAccessibleMode = this._accessibleMode.asObservable();

  setAccessibleTheme(isEnabled: boolean): void {
    this._accessibleMode.next(isEnabled);
  }
}
