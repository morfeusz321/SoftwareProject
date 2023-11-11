import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphOverviewGraphComponent } from './graph-overview-graph.component';
import { GraphListFacade } from '@app/dashboard/core/state/graph-list-store/graph-list.facade';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import * as presets from '@app/shared/testing_presets/testing_presets';
import { IGraph } from '@app/shared/interfaces/graph/graph.interface';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { graph1 } from '@app/shared/testing_presets/testing_presets';

describe('GraphOverviewGraphComponent', () => {
  let component: GraphOverviewGraphComponent;
  let fixture: ComponentFixture<GraphOverviewGraphComponent>;
  let graphListFacadeSpy: jasmine.SpyObj<GraphListFacade>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  const dialogRefMock: jasmine.SpyObj<MatDialogRef<any, any>> = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);

  beforeEach(async () => {
    const facadeSpy = jasmine.createSpyObj('GraphListFacade', ['loadGraphs', 'updateGraph', 'deleteGraph'], {
      graphs$: of([presets.graph1]),
    });
    const router = jasmine.createSpyObj('Router', ['navigate']);
    const dialog = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
    await TestBed;
    await TestBed.configureTestingModule({
      imports: [
        NgForOf,
        MatButtonModule,
        AsyncPipe,
        TranslocoModule,
        MatDialogModule,
        NgIf,
        MatInputModule,
        FormsModule,
        MatIconModule,
        MatTooltipModule,
      ],
      declarations: [GraphOverviewGraphComponent, MatTooltip],
      providers: [
        { provide: GraphListFacade, useValue: facadeSpy },
        { provide: Router, useValue: router },
        { provide: MatDialog, useValue: dialog },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GraphOverviewGraphComponent);
    graphListFacadeSpy = TestBed.inject(GraphListFacade) as jasmine.SpyObj<GraphListFacade>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    component = fixture.componentInstance;
    component.graph = presets.graph1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize', () => {
    component.ngOnInit();
    expect(component.isActiveString).toEqual('graphs.enabled');
  });

  it('should initialize', () => {
    component.graph = presets.graph2;
    component.ngOnInit();
    expect(component.isActiveString).toEqual('graphs.disabled');
  });

  it('should update active', () => {
    component.updateActive();
    expect(graphListFacadeSpy.updateGraph).toHaveBeenCalledWith({
      id: presets.graph1.id,
      isActive: !presets.graph1.isActive,
    } as IGraph);
  });

  it('should navigate to graph builder', () => {
    component.editGraph();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/builder', { id: presets.graph1.id }]);
  });

  it('should delete the graph', () => {
    dialogRefMock.afterClosed.and.returnValue(of(graph1.id)); // Simulate the dialog result here
    dialogSpy.open.and.returnValue(dialogRefMock);
    component.deletePopOut();

    expect(graphListFacadeSpy.deleteGraph).toHaveBeenCalledWith(graph1.id);
  });

  it('should rename the graph', () => {
    dialogRefMock.afterClosed.and.returnValue(of('name')); // Simulate the dialog result here
    dialogSpy.open.and.returnValue(dialogRefMock);
    component.renameGraph();

    expect(graphListFacadeSpy.updateGraph).toHaveBeenCalledWith({ id: presets.graph1.id, name: 'name' } as IGraph);
  });

  it('should close the rename dialog', () => {
    dialogRefMock.afterClosed.and.returnValue(of(undefined)); // Simulate the dialog result here
    dialogSpy.open.and.returnValue(dialogRefMock);
    component.renameGraph();

    expect(dialogSpy.closeAll).toHaveBeenCalled();
  });
});
