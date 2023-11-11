import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as GraphListActions from '@app/dashboard/core/state/graph-list-store/graph-list.actions';
import { GraphListFacade } from '@app/dashboard/core/state/graph-list-store/graph-list.facade';

describe('GraphListFacade', () => {
  let facade: GraphListFacade;
  let mockStore: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraphListFacade, provideMockStore()],
    });

    facade = TestBed.inject(GraphListFacade);
    mockStore = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should dispatch loadGraphs action', () => {
    const expectedAction = GraphListActions.loadGraphs();

    spyOn(mockStore, 'dispatch');
    facade.loadGraphs();
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch updateGraph action', () => {
    const graph = { id: 1 } as any;
    const expectedAction = GraphListActions.updateGraph({ graph });

    spyOn(mockStore, 'dispatch');
    facade.updateGraph(graph);
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch deleteGraph action', () => {
    const id = 1;
    const expectedAction = GraphListActions.deleteGraph({ id });

    spyOn(mockStore, 'dispatch');
    facade.deleteGraph(id);
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch resetError action', () => {
    const error = 'error';
    const expectedAction = GraphListActions.resetError({ error });

    spyOn(mockStore, 'dispatch');
    facade.resetError(error);
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
