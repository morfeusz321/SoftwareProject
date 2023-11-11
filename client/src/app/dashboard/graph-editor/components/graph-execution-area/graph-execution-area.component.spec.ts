import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraphExecutionAreaComponent } from './graph-execution-area.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { GraphExecutionLogsComponent } from '@app/dashboard/graph-execution/components/graph-execution-logs/graph-execution-logs.component';

describe('GraphExecutionAreaComponent', () => {
  let component: GraphExecutionAreaComponent;
  let fixture: ComponentFixture<GraphExecutionAreaComponent>;
  let graphExecutionLogsComponentSpy: jasmine.SpyObj<GraphExecutionLogsComponent>;

  beforeEach(() => {
    const graphExecLogsComponentSpy = jasmine.createSpyObj('GraphExecutionLogsComponent', [
      'executeGraph',
      'clearLogs',
    ]);
    TestBed.configureTestingModule({
      imports: [TranslocoTestingModule],
      declarations: [GraphExecutionAreaComponent],
      providers: [
        {
          provide: GraphExecutionLogsComponent,
          useValue: graphExecLogsComponentSpy,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GraphExecutionAreaComponent);
    graphExecutionLogsComponentSpy = TestBed.inject(
      GraphExecutionLogsComponent
    ) as jasmine.SpyObj<GraphExecutionLogsComponent>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit expanded state when expansionClicked is called', () => {
    spyOn(component.expandedChanged, 'emit');

    component.expansionClicked();

    expect(component.expandedChanged.emit).toHaveBeenCalledWith(component.expanded);
  });

  it('should expand and execute graph when executeGraph is called', () => {
    const eventMock = { stopPropagation: jasmine.createSpy('stopPropagation') };
    component.graphExecutionLogs = graphExecutionLogsComponentSpy;
    component.expanded = false;
    spyOn(component.expandedChanged, 'emit');

    component.executeGraph(eventMock);

    expect(eventMock.stopPropagation).toHaveBeenCalled();
    expect(component.expanded).toBe(true);
    expect(component.expandedChanged.emit).toHaveBeenCalledWith(true);
    expect(graphExecutionLogsComponentSpy.executeGraph).toHaveBeenCalled();
  });

  it('should clear logs when clearLogs is called', () => {
    const eventMock = { stopPropagation: jasmine.createSpy('stopPropagation') };
    component.graphExecutionLogs = graphExecutionLogsComponentSpy;
    component.clearLogs(eventMock);

    expect(eventMock.stopPropagation).toHaveBeenCalled();
    expect(graphExecutionLogsComponentSpy.clearLogs).toHaveBeenCalled();
  });
});
