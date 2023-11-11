import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphExecutionLogsComponent } from './graph-execution-logs.component';
import { GraphListFacade } from '@app/dashboard/core/state/graph-list-store/graph-list.facade';
import { expectedLog, graph1, testLog } from '@app/shared/testing_presets/testing_presets';
import { of } from 'rxjs';
import { ApiGraphExecutionService } from '@app/dashboard/graph-execution/services/graph-list-api-service/graph-execution-api-service';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslocoTestingModule } from '@ngneat/transloco';

describe('GraphExecutionLogsComponent', () => {
  let component: GraphExecutionLogsComponent;
  let graphListFacadeSpy: jasmine.SpyObj<GraphListFacade>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;
  let apiGraphExecutionService: jasmine.SpyObj<ApiGraphExecutionService>;
  let fixture: ComponentFixture<GraphExecutionLogsComponent>;

  beforeEach(async () => {
    const facadeSpy = jasmine.createSpyObj('GraphListFacade', ['loadGraphs']);
    const apiGraphExecutionSpy = jasmine.createSpyObj('ApiGraphExecutionService', ['executeGraph', 'getExecutionLog']);
    const cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      imports: [TranslocoTestingModule],
      declarations: [GraphExecutionLogsComponent],
      providers: [
        { provide: GraphListFacade, useValue: { ...facadeSpy, graphs$: of([graph1]) } },
        { provide: ApiGraphExecutionService, useValue: apiGraphExecutionSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GraphExecutionLogsComponent);
    graphListFacadeSpy = TestBed.inject(GraphListFacade) as jasmine.SpyObj<GraphListFacade>;
    apiGraphExecutionService = TestBed.inject(ApiGraphExecutionService) as jasmine.SpyObj<ApiGraphExecutionService>;
    cdr = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not use graphList', () => {
    component.graphListVisible = false;
    component.ngOnInit();

    expect(graphListFacadeSpy.loadGraphs).toHaveBeenCalledTimes(0);
    expect(component.length).toBeUndefined();
  });

  it('should use graphList', () => {
    component.graphListVisible = true;
    component.ngOnInit();

    expect(graphListFacadeSpy.loadGraphs).toHaveBeenCalled();
    expect(component.length).toEqual(1);
  });

  it('should return correct execution log', (done) => {
    apiGraphExecutionService.getExecutionLog.and.returnValue(of(testLog));
    apiGraphExecutionService.executeGraph.and.returnValue(of({}));
    component.selectedGraph = graph1;
    component.executeGraph();

    expect(apiGraphExecutionService.getExecutionLog).toHaveBeenCalled();
    expect(component.executionArray).toEqual(expectedLog);

    done();
  });
});
