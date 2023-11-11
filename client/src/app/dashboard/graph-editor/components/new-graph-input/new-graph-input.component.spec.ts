import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGraphInputComponent } from './new-graph-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiGraphListService } from '@app/dashboard/graph-editor/services/graph-list-api-service/graph-list-api-service';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { IGraph } from '@app/shared/interfaces/graph/graph.interface';
import { ConditionalTypeEnum } from '@app/shared/enums/conditional-type.enum';
import { ITriggerNode } from '@app/shared/interfaces/node/node.interface';
import { UuidService } from '@app/shared/services/uuid-generator/uuid.service';

describe('NewGraphInputComponent', () => {
  let component: NewGraphInputComponent;
  let fixture: ComponentFixture<NewGraphInputComponent>;
  let graphListServiceSpy: jasmine.SpyObj<ApiGraphListService>;
  let router: jasmine.SpyObj<Router>;
  let uuidServiceSpy: jasmine.SpyObj<UuidService>;
  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const uuidSpy = jasmine.createSpyObj('UuidService', ['generateUUID']);
    const apiGraphListServiceSpy = jasmine.createSpyObj('ApiGraphListService', ['createGraph']);
    await TestBed.configureTestingModule({
      declarations: [NewGraphInputComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ApiGraphListService, useValue: apiGraphListServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: UuidService, useValue: uuidSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NewGraphInputComponent);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    graphListServiceSpy = TestBed.inject(ApiGraphListService) as jasmine.SpyObj<ApiGraphListService>;
    uuidServiceSpy = TestBed.inject(UuidService) as jasmine.SpyObj<UuidService>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createGraph', () => {
    uuidServiceSpy.generateUUID.and.returnValue('uuid');
    const graphExpected = {
      id: 0,
      name: '',
      userId: 1,
      nodes: [
        {
          id: 'uuid',
          name: 'START',
          neighbours: [],
          position: { positionX: 600, positionY: 100, positionZ: 0 },
          type: ConditionalTypeEnum.TRIGGER,
          schedule: '',
        } as ITriggerNode,
      ],
      isActive: false,
      isDraft: false,
      schedule: null,
    } as IGraph;
    graphListServiceSpy.createGraph.and.returnValue(of(graphExpected));
    component.createGraph();
    expect(graphListServiceSpy.createGraph).toHaveBeenCalledWith(graphExpected);
    expect(router.navigate).toHaveBeenCalledWith(['/builder', { id: graphExpected.id }]);
  });
});
