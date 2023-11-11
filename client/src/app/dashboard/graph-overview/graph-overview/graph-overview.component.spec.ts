import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphOverviewComponent } from './graph-overview.component';
import {GraphListFacade} from "@app/dashboard/core/state/graph-list-store/graph-list.facade";
import * as presets from "@app/shared/testing_presets/testing_presets";
import {of} from "rxjs";
import {Router} from "@angular/router";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe('GraphOverviewComponent', () => {
  let component: GraphOverviewComponent;
  let fixture: ComponentFixture<GraphOverviewComponent>;
  let graphListFacadeSpy: jasmine.SpyObj<GraphListFacade>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const facadeSpy = jasmine.createSpyObj(
      'GraphListFacade',
      ['loadGraphs'],
      {
        graphs$: of([presets.graph1, presets.graph2])
      }
    );
    const router = jasmine.createSpyObj(
      'Router',
      ['navigate']
    );
    await TestBed.configureTestingModule({
      declarations: [ GraphOverviewComponent ],
      providers: [
        { provide: GraphListFacade, useValue: facadeSpy},
        { provide: Router, useValue: router},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();

    fixture = TestBed.createComponent(GraphOverviewComponent);
    graphListFacadeSpy = TestBed.inject(GraphListFacade) as jasmine.SpyObj<GraphListFacade>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize', () => {
    component.ngOnInit();
    expect(graphListFacadeSpy.loadGraphs).toHaveBeenCalled();
  });

  it('should navigate to /builder', () => {
    component.newGraph();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/builder']);
  });
});
