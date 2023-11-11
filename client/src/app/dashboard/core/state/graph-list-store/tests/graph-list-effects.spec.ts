import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { of, throwError } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { ApiGraphListService } from '@app/dashboard/graph-editor/services/graph-list-api-service/graph-list-api-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GraphListEffects } from '@app/dashboard/core/state/graph-list-store/graph-list.effects';
import * as GraphListActions from '@app/dashboard/core/state/graph-list-store/graph-list.actions';
import { GraphListFacade } from '@app/dashboard/core/state/graph-list-store/graph-list.facade';
import { IGraph } from '@app/shared/interfaces/graph/graph.interface';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('GraphListEffects', () => {
  const graph1: IGraph = {
    id: 1,
    name: 'graph1',
    nodes: [],
    isDraft: true,
    isActive: true,
    schedule: '1*111',
  };
  const graph2: IGraph = {
    id: 1,
    name: 'graph1',
    nodes: [],
    isDraft: true,
    isActive: true,
    schedule: '1*111',
  };

  let actions$: any;
  let effects: GraphListEffects;
  let graphListFacadeSpy: jasmine.SpyObj<GraphListFacade>;
  let apiGraphListServiceSpy: jasmine.SpyObj<ApiGraphListService>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    const facadeSpy = jasmine.createSpyObj('GraphListFacade', ['loadGraphs', 'updateGraph']);
    const apiGraphListSpy = jasmine.createSpyObj('ApiGraphListService', ['updateGraph', 'getGraphs', 'deleteGraph']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot(), BrowserAnimationsModule],
      providers: [
        GraphListEffects,
        HttpClientModule,
        provideMockActions(() => actions$),
        { provide: GraphListFacade, useValue: { ...facadeSpy, graphs$: of([graph1, graph2]) } },
        { provide: ApiGraphListService, useValue: apiGraphListSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    });

    effects = TestBed.inject(GraphListEffects);
    graphListFacadeSpy = TestBed.inject(GraphListFacade) as jasmine.SpyObj<GraphListFacade>;
    apiGraphListServiceSpy = TestBed.inject(ApiGraphListService) as jasmine.SpyObj<ApiGraphListService>;
    toastrServiceSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('loadGraphs$', () => {
    const graphArr = [graph1, graph2];
    it('should dispatch loadGraphsSuccess action', () => {
      const expectedAction = GraphListActions.loadGraphsSuccess({ graphs: graphArr });
      apiGraphListServiceSpy.getGraphs.and.returnValue(of(graphArr));
      actions$ = of(GraphListActions.loadGraphs());
      effects.loadGraphs$.subscribe((action) => {
        expect(action).toEqual(expectedAction);
      });
    });

    it('should dispatch loadGraphsFailure action', () => {
      const error = {error: {detail:'BWaHaAaaaaaaaaaaaaa'}};
      const expectedAction = GraphListActions.loadGraphsFailure({ error: error.error.detail });
      actions$ = of(GraphListActions.loadGraphs());
      apiGraphListServiceSpy.getGraphs.and.returnValue(throwError(error));
      effects.loadGraphs$.subscribe((action) => {
        expect(action).toEqual(expectedAction);
      });
    });
  });

  describe('updateGraph$', () => {
    it('should dispatch updateGraphsSuccess', () => {
      const expectedAction = GraphListActions.updateGraphSuccess({ graph: graph1 });
      apiGraphListServiceSpy.updateGraph.and.returnValue(of(graph1));
      actions$ = of(GraphListActions.updateGraph({ graph: graph1 }));
      effects.updateGraph$.subscribe((action) => {
        expect(action).toEqual(expectedAction);
      });
    });

    it('should dispatch updateGraphsFailure action', () => {
      const error = {error: {detail:'AaAaa.. Error'}};
      const expectedAction = GraphListActions.updateGraphFailure({ error: error.error.detail });
      apiGraphListServiceSpy.updateGraph.and.returnValue(throwError(error));
      actions$ = of(GraphListActions.updateGraph({ graph: graph1 }));
      effects.updateGraph$.subscribe((action) => {
        expect(action).toEqual(expectedAction);
      });
    });
  });

  describe('deleteGraph$', () => {
    it('should dispatch deleteGraphsSuccess', () => {
      const expectedAction = GraphListActions.deleteGraphSuccess({ id: graph1.id });
      apiGraphListServiceSpy.deleteGraph.and.returnValue(of(graph1));
      actions$ = of(GraphListActions.deleteGraph({ id: graph1.id }));
      effects.deleteGraph$.subscribe((action) => {
        expect(action).toEqual(expectedAction);
      });
    });
    // TODO: fix this test
    // it('should dispatch loadGraphsFailure action', () => {
    //   const error = new Error('AaAaa.. Error');
    //   const expectedAction = GraphListActions.deleteGraphFailure({ error: error.message });
    //   apiGraphListServiceSpy.deleteGraph.and.returnValue(throwError(error));
    //   actions$ = of(GraphListActions.deleteGraph({ id: graph1.id }));
    //   effects.deleteGraph$.subscribe((action) => {
    //     expect(action).toEqual(expectedAction);
    //   });
    // });
  });
});
