import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { INode } from '@app/shared/interfaces/node/node.interface';
import { ICoordinates } from '@app/shared/interfaces/coordinates/coordinates.interface';
import * as GraphEditorActions from '@app/dashboard/core/state/graph-editor-store/graph-editor.actions';
import { GraphEditorFacade } from '@app/dashboard/core/state/graph-editor-store/graph-editor.facade';
import { ConditionalTypeEnum } from '@app/shared/enums/conditional-type.enum';

describe('GraphEditorFacade', () => {
  let facade: GraphEditorFacade;
  let mockStore: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraphEditorFacade, provideMockStore()],
    });

    facade = TestBed.inject(GraphEditorFacade);
    mockStore = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should dispatch addNode action', () => {
    const expectedAction = GraphEditorActions.addNode({
      position: {
        positionX: 0,
        positionY: 0,
        positionZ: 0,
      },
      nodeConfig: { method: ConditionalTypeEnum.IF },
    });

    spyOn(mockStore, 'dispatch');
    facade.addNode(
      { method: ConditionalTypeEnum.IF },
      {
        positionX: 0,
        positionY: 0,
        positionZ: 0,
      }
    );
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch removeNode action', () => {
    const id = '1';
    const expectedAction = GraphEditorActions.removeNode({ id });

    spyOn(mockStore, 'dispatch');
    facade.removeNode(id);
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch updateNode action', () => {
    const node: INode = {} as INode;
    const expectedAction = GraphEditorActions.updateNode({ node });

    spyOn(mockStore, 'dispatch');
    facade.updateNode(node);
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch selectNode action', () => {
    const id = '1';
    const expectedAction = GraphEditorActions.selectNode({ id });

    spyOn(mockStore, 'dispatch');
    facade.selectNode(id);
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch updateIsDraft action', () => {
    const isDraft = true;
    const expectedAction = GraphEditorActions.updateIsDraft({ isDraft });

    spyOn(mockStore, 'dispatch');
    facade.updateIsDraft(isDraft);
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch updateIsActive action', () => {
    const isActive = true;
    const expectedAction = GraphEditorActions.updateIsActive({ isActive });

    spyOn(mockStore, 'dispatch');
    facade.updateIsActive(isActive);
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch updateLastSaved action', () => {
    const lastSaved = '2022-01-01';
    const expectedAction = GraphEditorActions.updateLastSaved({ lastSaved });

    spyOn(mockStore, 'dispatch');
    facade.updateLastSaved(lastSaved);
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch reset action', () => {
    const expectedAction = GraphEditorActions.reset();

    spyOn(mockStore, 'dispatch');
    facade.reset();
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch disconnectNodes action', () => {
    const source = '1';
    const target = '2';
    const expectedAction = GraphEditorActions.disconnectNodes({ source, target });

    spyOn(mockStore, 'dispatch');
    facade.disconnectNodes(source, target);
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch connectNodes action', () => {
    const source = '1';
    const target = '2';
    const expectedAction = GraphEditorActions.connectNodes({ source, target });

    spyOn(mockStore, 'dispatch');
    facade.connectNodes(source, target);
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch saveGraph action', () => {
    const expectedAction = GraphEditorActions.saveGraph();

    spyOn(mockStore, 'dispatch');
    facade.saveGraph();
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch updateNodePosition action', () => {
    const id = '1';
    const position: ICoordinates = { positionX: 0, positionY: 0, positionZ: 0 };
    const expectedAction = GraphEditorActions.updateNodePosition({ id, position });

    spyOn(mockStore, 'dispatch');
    facade.updateNodePosition(id, position);
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch resetNodes action', () => {
    const expectedAction = GraphEditorActions.resetNodes();

    spyOn(mockStore, 'dispatch');
    facade.resetNodes();
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch deselectNode action', () => {
    const expectedAction = GraphEditorActions.deselectNode();

    spyOn(mockStore, 'dispatch');
    facade.deselectNode();
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch updateIsLoading action', () => {
    const isLoading = true;
    const expectedAction = GraphEditorActions.updateIsLoading({ isLoading });

    spyOn(mockStore, 'dispatch');
    facade.updateIsLoading(isLoading);
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch loadGraph action', () => {
    const expectedAction = GraphEditorActions.loadGraph({ graphId: 1 });

    spyOn(mockStore, 'dispatch');
    facade.loadGraph(1);
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch highlightNode action', () => {
    const id = '1';
    const expectedAction = GraphEditorActions.highlightNode({ id });

    spyOn(mockStore, 'dispatch');
    facade.highlightNode(id);
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch clearHighlighted action', () => {
    const expectedAction = GraphEditorActions.clearHighlighted();

    spyOn(mockStore, 'dispatch');
    facade.clearHighlighted();
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch updateName action', () => {
    const name = 'name';
    const expectedAction = GraphEditorActions.updateName({ name });

    spyOn(mockStore, 'dispatch');
    facade.updateName(name);
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch resetError action', () => {
    const expectedAction = GraphEditorActions.resetError({ error: null });

    spyOn(mockStore, 'dispatch');
    facade.resetError(null);
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
