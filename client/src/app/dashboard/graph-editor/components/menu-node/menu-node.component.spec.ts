import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuNodeComponent } from './menu-node.component';
import {ConditionalTypeEnum} from "@app/shared/enums/conditional-type.enum";
import {TranslocoTestingModule} from "@ngneat/transloco";

describe('MenuNodeComponent', () => {
  let component: MenuNodeComponent;
  let fixture: ComponentFixture<MenuNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslocoTestingModule],
      declarations: [MenuNodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuNodeComponent);
    component = fixture.componentInstance;
    component.menuNode = { method: ConditionalTypeEnum.IF };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
