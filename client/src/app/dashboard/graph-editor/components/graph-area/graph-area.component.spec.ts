import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Edge, GraphAreaComponent } from './graph-area.component';
import { GraphEditorFacade } from '@app/dashboard/core/state/graph-editor-store/graph-editor.facade';
import { BasicNodeComponent } from '@app/dashboard/graph-editor/components/basic-node/basic-node.component';
import { BehaviorSubject, of } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NodeConfig } from '@app/shared/configs/node-menu.config';
import { MethodsEnum } from '@app/shared/enums/methods.enum';
import { INode } from '@app/shared/interfaces/node/node.interface';
import { ElementRef, QueryList } from '@angular/core';
import { LeaderLineService } from '@app/shared/services/leader-line-service/leader-line.service';
import { TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { ApiGraphExecutionService } from '@app/dashboard/graph-execution/services/graph-list-api-service/graph-execution-api-service';
describe('GraphAreaComponent', () => {
  let component: GraphAreaComponent;
  let fixture: ComponentFixture<GraphAreaComponent>;
  let graphEditorFacadeSpy: jasmine.SpyObj<GraphEditorFacade>;
  let basicNodeComponentSpy: jasmine.SpyObj<BasicNodeComponent>;
  let messageServiceSpy: jasmine.SpyObj<ToastrService>;
  let leaderLineServiceSpy: jasmine.SpyObj<LeaderLineService>;
  let translocoServiceSpy: jasmine.SpyObj<TranslocoService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let apiExecutionSpy: jasmine.SpyObj<ApiGraphExecutionService>;
  let edges$ = new BehaviorSubject<Edge[]>([]);

  beforeEach(async () => {
    const basicNodeSpy = jasmine.createSpyObj('BasicNodeComponent', ['dragStart', 'getX', 'getY']);
    const facadeSpy = jasmine.createSpyObj('GraphEditorFacade', [
      'addNode',
      'removeNode',
      'updateNodePosition',
      'selectNode',
      'connectNodes',
      'disconnectNodes',
      'deselectNode',
    ]);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success']);
    const edgeServiceSPy = jasmine.createSpyObj('LeaderLineService', ['createLeaderLine']);
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate']);
    await TestBed.configureTestingModule({
      declarations: [GraphAreaComponent],
      imports: [ToastrModule.forRoot(), BrowserAnimationsModule],
      providers: [
        { provide: GraphEditorFacade, useValue: { ...facadeSpy, edges$: of([{ from: 'id1', to: 'id2' }]) } },
        { provide: BasicNodeComponent, useValue: basicNodeSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
        { provide: LeaderLineService, useValue: edgeServiceSPy },
        { provide: TranslocoService, useValue: translocoServiceSpy },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(GraphAreaComponent);
    graphEditorFacadeSpy = TestBed.inject(GraphEditorFacade) as jasmine.SpyObj<GraphEditorFacade>;
    basicNodeComponentSpy = TestBed.inject(BasicNodeComponent) as jasmine.SpyObj<BasicNodeComponent>;
    messageServiceSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    leaderLineServiceSpy = TestBed.inject(LeaderLineService) as jasmine.SpyObj<LeaderLineService>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(graphEditorFacadeSpy.edges$).toBeTruthy();
    expect(component.drag).toBeFalsy();
    expect(component.linkLines).toEqual([]);
  });

  describe('createNode', () => {
    it('should create a node when all conditions are true', () => {
      basicNodeComponentSpy.getX.and.returnValue(5);
      basicNodeComponentSpy.getY.and.returnValue(10);
      const nodeConfig: NodeConfig = { method: MethodsEnum.PUT };
      const x = 500;
      const y = 500;
      component.graphDiv = {
        element: { nativeElement: { getBoundingClientRect: () => ({ left: 100, right: 700, top: 100, bottom: 700 }) } },
      } as any;
      component.createNode(x, y, nodeConfig);

      expect(graphEditorFacadeSpy.addNode).toHaveBeenCalledWith(nodeConfig, {
        positionX: 395,
        positionY: 390,
        positionZ: 0,
      });
    });

    it('should not create a node when condition 1 is false', () => {
      const nodeConfig: NodeConfig = { method: MethodsEnum.PUT };
      const x = 50;
      const y = 500;
      component.graphDiv = {
        element: { nativeElement: { getBoundingClientRect: () => ({ left: 100, right: 700, top: 100, bottom: 700 }) } },
      } as any;
      component.createNode(x, y, nodeConfig);

      expect(graphEditorFacadeSpy.addNode).not.toHaveBeenCalled();
    });

    it('should not create a node when condition 2 is false', () => {
      const nodeConfig: NodeConfig = { method: MethodsEnum.PUT };
      const x = 900;
      const y = 500;
      component.graphDiv = {
        element: { nativeElement: { getBoundingClientRect: () => ({ left: 100, right: 700, top: 100, bottom: 700 }) } },
      } as any;

      component.createNode(x, y, nodeConfig);

      expect(graphEditorFacadeSpy.addNode).not.toHaveBeenCalled();
    });

    it('should not create a node when condition 3 is false', () => {
      const nodeConfig: NodeConfig = { method: MethodsEnum.PUT };
      const x = 500;
      const y = 50;
      component.graphDiv = {
        element: { nativeElement: { getBoundingClientRect: () => ({ left: 100, right: 700, top: 100, bottom: 700 }) } },
      } as any;

      component.createNode(x, y, nodeConfig);

      expect(graphEditorFacadeSpy.addNode).not.toHaveBeenCalled();
    });

    it('should not create a node when condition 4 is false', () => {
      const nodeConfig: NodeConfig = { method: MethodsEnum.PUT };
      const x = 500;
      const y = 900;
      component.graphDiv = {
        element: { nativeElement: { getBoundingClientRect: () => ({ left: 100, right: 700, top: 100, bottom: 700 }) } },
      } as any;

      component.createNode(x, y, nodeConfig);

      expect(graphEditorFacadeSpy.addNode).not.toHaveBeenCalled();
    });
  });

  it('should update the position of a node', () => {
    const id = 'node1';
    component.graphDiv = { element: { nativeElement: { getBoundingClientRect: () => ({ x: 10, y: 10 }) } } } as any;
    const elementMock = {
      getBoundingClientRect: jasmine.createSpy('getBoundingClientRect').and.returnValue({
        x: 10,
        y: 20,
      }),
    } as any;
    spyOn(document, 'getElementById').and.returnValue(elementMock);
    component.updatePos(id);

    expect(component.drag).toBeFalse();
    expect(graphEditorFacadeSpy.updateNodePosition).toHaveBeenCalledWith(id, {
      positionX: 0,
      positionY: 10,
      positionZ: 0,
    });
  });

  describe('updateEdgePositions', () => {
    it('should reset the edges', () => {
      component.edges$ = edges$;
      spyOn(component, 'resetEdges');

      component.updateEdgePositions();

      expect(component.resetEdges).toHaveBeenCalled();
    });

    it('should add each edge', () => {
      component.edges$ = edges$;
      const mockEdges = [{ from: 'node1', to: 'node2' }];
      spyOn(component, 'addEdge');

      edges$.next(mockEdges);
      component.updateEdgePositions();

      expect(component.addEdge).toHaveBeenCalledTimes(mockEdges.length);
      mockEdges.forEach((edge) => {
        expect(component.addEdge).toHaveBeenCalledWith(edge);
      });
    });

    it('should move leader lines to the graph area', () => {
      component.edges$ = edges$;

      const leaderLineElement = document.createElement('svg');
      leaderLineElement.classList.add('leader-line');
      leaderLineElement.style.left = '10px';
      leaderLineElement.style.top = '10px';
      const leaderLineElements = document.querySelectorAll('.leader-line');
      spyOn(component.graphDiv.element.nativeElement, 'appendChild').and.stub();
      //spyOn(component, 'repositionEdges').and.stub();
      spyOn(document, 'querySelectorAll').and.returnValue(leaderLineElements);
      spyOn(component, 'updateEdgePositions').and.callThrough();
      component.updateEdgePositions();

      expect(document.querySelectorAll).toHaveBeenCalledWith('.leader-line');
      expect(component.graphDiv.element.nativeElement.appendChild).toHaveBeenCalledTimes(leaderLineElements.length);
      leaderLineElements.forEach((line) => {
        expect(component.graphDiv.element.nativeElement.appendChild).toHaveBeenCalledWith(line);
      });
      expect(component.updateEdgePositions).toHaveBeenCalledTimes(1);
    });

    it('should reposition edges', () => {
      component.edges$ = edges$;
      const leaderLineElement = document.createElement('svg');
      leaderLineElement.classList.add('leader-line');
      leaderLineElement.style.left = '10px';
      leaderLineElement.style.top = '10px';
      const leaderLineElements = document.querySelectorAll('.leader-line');
      component.graphDiv = {
        element: { nativeElement: { getBoundingClientRect: () => ({ x: 10, y: 10 }), appendChild: () => true } },
      } as any;

      spyOn(document, 'querySelectorAll').and.returnValue(leaderLineElements);
      spyOn(leaderLineElements, 'forEach').and.callFake((callback) => {
        callback(leaderLineElement, 0, leaderLineElements);
      });
      spyOn(leaderLineElement.style, 'setProperty').and.stub();

      component.repositionEdges();

      expect(document.querySelectorAll).toHaveBeenCalledWith('.leader-line');
      expect(leaderLineElements.forEach).toHaveBeenCalledTimes(1);
      expect(leaderLineElement.style.setProperty).toHaveBeenCalledTimes(2);
    });

    it('should reset edges', () => {
      component.edges$ = edges$;
      const parent = document.createElement('div');
      let leaderLineElement = document.createElement('svg');
      leaderLineElement.classList.add('leader-line');
      leaderLineElement.style.left = '10px';
      leaderLineElement.style.top = '10px';
      leaderLineElement = { ...leaderLineElement, parentNode: parent };
      const leaderLineElements = document.querySelectorAll('.leader-line');
      spyOn(document, 'querySelectorAll').and.returnValue(leaderLineElements);
      spyOn(leaderLineElements, 'forEach').and.callFake((callback) => {
        callback(leaderLineElement, 0, leaderLineElements);
      });
      spyOn(leaderLineElement.parentNode, 'removeChild').and.stub();

      component.resetEdges();

      expect(document.querySelectorAll).toHaveBeenCalledWith('.leader-line');
      expect(leaderLineElements.forEach).toHaveBeenCalledTimes(1);
      expect(leaderLineElement.parentNode.removeChild).toHaveBeenCalledTimes(1);
      expect(component.linkLines).toEqual([]);
    });
  });

  it('should select a node', () => {
    const id = 'node1';
    component.selectNode(id);

    expect(graphEditorFacadeSpy.selectNode).toHaveBeenCalledWith(id);
  });

  it('should deselect node if already selected', () => {
    const id = 'node1';
    component.selectedSourceNode = id;
    component.selectNodeToConnect(id, false);

    expect(component.selectedSourceNode).toEqual(null);
  });

  it('should select first node as source', () => {
    const id = 'node1';
    component.selectedSourceNode = null;
    component.selectNodeToConnect(id, false);

    expect(component.selectedSourceNode).toEqual(id);
  });

  it('should select second node as target', () => {
    const id = 'node1';
    const id2 = 'node2';
    component.selectedSourceNode = id;
    component.edges$ = of([]);
    component.selectNodeToConnect(id2, false);

    expect(component.selectedTargetNode).toEqual(null);
    expect(component.selectedSourceNode).toEqual(null);
    expect(graphEditorFacadeSpy.connectNodes).toHaveBeenCalledWith(id, id2);
  });

  it('should disconnect nodes if the edge exists', () => {
    const id = 'node1';
    const id2 = 'node2';
    component.selectedSourceNode = id;
    component.edges$ = of([{ from: id, to: id2 } as Edge]);
    component.selectNodeToConnect(id2, false);

    expect(component.selectedTargetNode).toEqual(null);
    expect(component.selectedSourceNode).toEqual(null);
    expect(graphEditorFacadeSpy.disconnectNodes).toHaveBeenCalledWith(id, id2);
  });

  it('should trigger drag', () => {
    let node = {} as INode;
    node.id = 'node1';
    component.triggerDrag(node);

    expect(component.drag).toBeTrue();
    expect(component.lastNode).toEqual(node);
  });

  it('should delete node', () => {
    const nodeId = 'node1';
    component.deleteNode(nodeId);
    expect(graphEditorFacadeSpy.removeNode).toHaveBeenCalledWith(nodeId);
    expect(graphEditorFacadeSpy.deselectNode).toHaveBeenCalled();
    expect(messageServiceSpy.success).toHaveBeenCalled();
  });

  it('should add edges on init', () => {
    let node1 = {} as INode;
    node1.id = 'id1';
    let node2 = {} as INode;
    node2.id = 'id2';
    const nodeComponent1 = new BasicNodeComponent(translocoServiceSpy, messageServiceSpy, apiExecutionSpy, dialogSpy);
    const nodeComponent2 = new BasicNodeComponent(translocoServiceSpy, messageServiceSpy, apiExecutionSpy, dialogSpy);
    nodeComponent1.node = node1;
    nodeComponent1.nodeContainer = new ElementRef<any>('');
    nodeComponent2.node = node2;
    nodeComponent2.nodeContainer = new ElementRef<any>('');
    component.nodeComponents = [nodeComponent1, nodeComponent2] as unknown as QueryList<BasicNodeComponent>;
    leaderLineServiceSpy.createLeaderLine.and.returnValue({});
    component.ngAfterViewInit();

    expect(component.linkLines.length).toEqual(1);
  });
});
