import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphBuilderComponent } from './graph-builder.component';
import { GraphEditorFacade } from '@app/dashboard/core/state/graph-editor-store/graph-editor.facade';
import { BasicNodeComponent } from '@app/dashboard/graph-editor/components/basic-node/basic-node.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ConditionalTypeEnum } from '@app/shared/enums/conditional-type.enum';
import { of } from 'rxjs';
import { GraphAreaComponent } from '@app/dashboard/graph-editor/components/graph-area/graph-area.component';
import { NodeConfig, NodeMenuConfig } from '@app/shared/configs/node-menu.config';
import * as presets from '@app/shared/testing_presets/testing_presets';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { ApiCustomNodeService } from '@app/dashboard/graph-editor/services/custom-node-api-service/custom-node-api.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import { CreateNewCustomNodeDialogComponent } from '@app/dashboard/node-editor/components/new-node-dialog/create-new-custom-node-dialog.component';
import { IActionNode, ICustomNode } from '@app/shared/interfaces/node/node.interface';
import { InsocialMethodsEnum, MethodsEnum } from '@app/shared/enums/methods.enum';

describe('GraphBuilderComponent', () => {
  let component: GraphBuilderComponent;
  let graphEditorFacade: jasmine.SpyObj<GraphEditorFacade>;
  let basicNode: jasmine.SpyObj<BasicNodeComponent>;
  let graphArea: jasmine.SpyObj<GraphAreaComponent>;
  let fixture: ComponentFixture<GraphBuilderComponent>;
  let customNodeService: jasmine.SpyObj<ApiCustomNodeService>;
  let dialogServiceSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const limits: Record<ConditionalTypeEnum, boolean> = {} as Record<ConditionalTypeEnum, boolean>;
    limits[ConditionalTypeEnum.TRIGGER] = true;
    const basicNodeSpy = jasmine.createSpyObj('BasicNodeComponent', ['dragStart']);
    const graphAreaComponentSpy = jasmine.createSpyObj('GraphAreaComponent', ['createNode']);
    const graphEditorFacadeSpy = jasmine.createSpyObj('GraphEditorFacade', ['graph$']);
    const customNodeServiceSpy = jasmine.createSpyObj('ApiCustomNodeService', [
      'saveCustomNode',
      'getNodes',
      'updateCustomNode',
      'deleteNode',
      'getCustomNode',
    ]);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    await TestBed.configureTestingModule({
      declarations: [GraphBuilderComponent],
      imports: [TranslocoTestingModule, MatDialogModule, ToastrModule.forRoot()],
      providers: [
        { provide: GraphAreaComponent, useValue: graphAreaComponentSpy },
        { provide: BasicNodeComponent, useValue: basicNodeSpy },
        { provide: ApiCustomNodeService, useValue: customNodeServiceSpy },
        {
          provide: GraphEditorFacade,
          useValue: { ...graphEditorFacadeSpy, limits$: of(limits), graph$: of(presets.graph1) },
        },
        { provide: MatDialog, useValue: dialogSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GraphBuilderComponent);
    graphEditorFacade = TestBed.inject(GraphEditorFacade) as jasmine.SpyObj<GraphEditorFacade>;
    basicNode = TestBed.inject(BasicNodeComponent) as jasmine.SpyObj<BasicNodeComponent>;
    graphArea = TestBed.inject(GraphAreaComponent) as jasmine.SpyObj<GraphAreaComponent>;
    customNodeService = TestBed.inject(ApiCustomNodeService) as jasmine.SpyObj<ApiCustomNodeService>;
    dialogServiceSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    customNodeServiceSpy.getNodes.and.returnValue(of([]));
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create with correct params', () => {
    const actionNodeConfig = [
      {
        method: MethodsEnum.POST,
      },
      {
        method: MethodsEnum.PUT,
      },
      {
        method: MethodsEnum.GET,
      },
    ];
    const conditionalNodeConfig = [
      {
        method: ConditionalTypeEnum.IF,
      },
      {
        method: ConditionalTypeEnum.FILTER,
      },
      {
        method: ConditionalTypeEnum.MAP,
      },
    ];
    const nodeMenuConfig = NodeMenuConfig;
    const insocialNodeConfig = [
      {
        method: InsocialMethodsEnum.INVITE,
      },
    ];
    expect(component).toBeTruthy();
    expect(component.actionNodeConfig).toEqual(actionNodeConfig);
    expect(component.conditionalNodeConfig).toEqual(conditionalNodeConfig);
    expect(component.nodeMenuConfig).toEqual(nodeMenuConfig);
    expect(component.insocialNodeConfig).toEqual(insocialNodeConfig);
    expect(component.executionExpanded).toBeFalse();
  });

  it('should call drop', () => {
    component.graphArea = graphArea;
    const event = { event: { x: 0, y: 0 }, source: { data: {} } };
    component.drop(event);
    expect(graphArea.createNode).toHaveBeenCalledWith(0, 0, {} as NodeConfig);
  });

  it('should call pressed', () => {
    const event = { event: { x: 0, y: 0 }, source: { data: {} } };
    component.pressed(event);
    expect(basicNode.dragStart).toHaveBeenCalledWith(event);
  });

  it('should call noReturnPredicate', () => {
    expect(component.noReturnPredicate()).toBeFalse();
  });

  it('should open the create new custom node dialog', () => {
    component.customNodes = [];
    const customNode = { id: 1, label: 'Custom Node 1', action: {} as IActionNode };
    dialogServiceSpy.open.and.returnValue({ afterClosed: () => of(customNode) } as any);
    customNodeService.saveCustomNode.and.returnValue(of(customNode));
    component.openDialog();

    expect(dialogServiceSpy.open).toHaveBeenCalledWith(CreateNewCustomNodeDialogComponent, jasmine.any(Object));
    expect(customNodeService.saveCustomNode).toHaveBeenCalledWith(customNode);
    expect(component.customNodes).toEqual([customNode]);
  });

  it('should open the update custom node dialog and not call anything if cancelled', () => {
    const customNode = { id: 1, label: 'Custom Node 1', action: {} as IActionNode };
    dialogServiceSpy.open.and.returnValue({ afterClosed: () => of(null) } as any);
    component.openDialog(customNode);

    expect(dialogServiceSpy.open).toHaveBeenCalledWith(CreateNewCustomNodeDialogComponent, jasmine.any(Object));
    expect(customNodeService.updateCustomNode).not.toHaveBeenCalled();
    expect(customNodeService.saveCustomNode).not.toHaveBeenCalled();
  });

  it('should open the update custom node dialog and call update if not cancelled', () => {
    const customNode = { id: 1, label: 'Custom Node 1', action: {} as IActionNode };
    component.customNodes = [customNode];
    const updatedCustomNode = { id: 1, label: 'Updated Custom Node 1', action: {} as IActionNode };
    dialogServiceSpy.open.and.returnValue({ afterClosed: () => of(updatedCustomNode) } as any);
    customNodeService.updateCustomNode.and.returnValue(of(updatedCustomNode));
    component.openDialog(customNode);

    expect(dialogServiceSpy.open).toHaveBeenCalledWith(CreateNewCustomNodeDialogComponent, {
      width: '400px',
      height: '600px',
      data: customNode,
    });
    expect(customNodeService.updateCustomNode).toHaveBeenCalledWith(updatedCustomNode);
    expect(customNodeService.saveCustomNode).not.toHaveBeenCalled();
    expect(component.customNodes).toEqual([updatedCustomNode]);
  });

  it('should delete custom Node', () => {
    const customNode = { id: 1, label: 'Custom Node 1', action: {} as IActionNode };
    component.customNodes = [customNode];
    customNodeService.deleteNode.and.returnValue(of({} as ICustomNode));
    component.deleteCustomNode(1);

    expect(customNodeService.deleteNode).toHaveBeenCalledWith(customNode.id);
    expect(component.customNodes).toEqual([]);
  });

  it('should handle expanded changed', () => {
    const expanded = true;

    component.handleExpandedChanged(expanded);

    expect(component.executionExpanded).toBe(expanded);
  });

  it('should handle dropCustom', () => {
    component.graphArea = graphArea;
    const event = { event: { x: 0, y: 0 }, source: { data: { action: { type: MethodsEnum.GET } as IActionNode } } };
    component.dropCustom(event);
    expect(graphArea.createNode).toHaveBeenCalledWith(0, 0, {
      action: { type: MethodsEnum.GET },
      method: MethodsEnum.GET,
    } as NodeConfig);
  });
});
