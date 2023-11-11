import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicNodeComponent } from './basic-node.component';
import { ICoordinates } from '@app/shared/interfaces/coordinates/coordinates.interface';
import { ConditionalTypeEnum } from '@app/shared/enums/conditional-type.enum';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { TranslocoService, TranslocoTestingModule } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiGraphExecutionService } from '@app/dashboard/graph-execution/services/graph-list-api-service/graph-execution-api-service';
import { of, throwError } from 'rxjs';
import { HttpResponseDialogComponent } from '@app/dashboard/node-editor/components/http-response-dialog/http-response-dialog.component';
import { MethodsEnum } from '@app/shared/enums/methods.enum';
import { IActionNode } from '@app/shared/interfaces/node/node.interface';

describe('BasicNodeComponent', () => {
  let component: BasicNodeComponent;
  let fixture: ComponentFixture<BasicNodeComponent>;
  let deleteNodeSpy: jasmine.Spy;
  let editNodeSpy: jasmine.Spy;
  let selectNodeSpy: jasmine.Spy;
  let deleteNodeButton: DebugElement;
  let editNodeButton: DebugElement;
  let nodeInfo: DebugElement;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let apiExecutionSpy: jasmine.SpyObj<ApiGraphExecutionService>;
  const dialogRefMock: jasmine.SpyObj<MatDialogRef<any, any>> = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
  const node = {
    id: '1',
    name: 'test',
    type: ConditionalTypeEnum.IF,
    position: {} as ICoordinates,
    neighbours: [],
  };

  beforeEach(async () => {
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success']);
    const dialog = jasmine.createSpyObj('MatDialog', ['open']);
    const executionSpy = jasmine.createSpyObj('ApiGraphExecutionService', ['executeNode']);
    await TestBed.configureTestingModule({
      imports: [
        MatBadgeModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatTooltipModule,
        TranslocoTestingModule,
      ],
      declarations: [BasicNodeComponent],
      providers: [
        { provide: ToastrService, useValue: toastrServiceSpy },
        { provide: MatDialog, useValue: dialog },
        { provide: ApiGraphExecutionService, useValue: executionSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BasicNodeComponent);
    component = fixture.componentInstance;
    component.node = node;
    deleteNodeSpy = spyOn(component.deleteNode, 'emit');
    editNodeSpy = spyOn(component.editNode, 'emit');
    selectNodeSpy = spyOn(component.selectNode, 'emit');
    apiExecutionSpy = TestBed.inject(ApiGraphExecutionService) as jasmine.SpyObj<ApiGraphExecutionService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.selectedAsSource).toBeFalsy();
    expect(component.shadowNode).toBeFalsy();
    expect(component.highlighted).toBeFalsy();
  });

  it('should return correct class', () => {
    expect(component.class).toEqual({ ['basic-node--if']: true, ['basic-node--selected']: false });

    component.selectedAsSource = true;

    expect(component.class).toEqual({ ['basic-node--if']: true, ['basic-node--selected']: true });

    component.shadowNode = true;

    expect(component.class).toEqual('basic-node--shadow');

    component.shadowNode = false;
    component.node = null;

    expect(component.class).toEqual('');
  });

  it('should emit deleteNode event when deleteNodeClicked is called', () => {
    deleteNodeButton = fixture.debugElement.query(By.css('.delete-button'));
    deleteNodeButton.triggerEventHandler('click', null);

    expect(deleteNodeSpy).toHaveBeenCalledWith('1');
  });

  it('should emit editNode event when editNodeClicked is called', () => {
    editNodeButton = fixture.debugElement.query(By.css('.edit-button'));
    editNodeButton.triggerEventHandler('click', null);

    expect(editNodeSpy).toHaveBeenCalledWith('1');
  });

  it('should emit selectNode event when nodeContainer is clicked', () => {
    nodeInfo = fixture.debugElement.query(By.css('.node-container__info'));
    nodeInfo.triggerEventHandler('click', null);

    expect(selectNodeSpy).toHaveBeenCalledWith('1');
  });

  it('should handle dragStart event', () => {
    const event = {
      target: {
        getBoundingClientRect: jasmine.createSpy('getBoundingClientRect').and.returnValue({
          left: 10,
          top: 10,
        }),
      },
      clientX: 30,
      clientY: 30,
    };
    component.dragStart(event);
    expect(component.getX()).toEqual(20);
    expect(component.getY()).toEqual(20);
  });

  it('should execute the node and open the response dialog on success', () => {
    const mockResponse = { test: 'test' };
    const getNode = { ...node, type: MethodsEnum.GET, request: { url: 'test' } } as IActionNode;
    component.node = getNode;
    apiExecutionSpy.executeNode.and.returnValue(of(mockResponse));

    component.executeNode();

    expect(apiExecutionSpy.executeNode).toHaveBeenCalledWith(getNode);
    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should execute the node and open the error dialog on failure', () => {
    const getNode = { ...node, type: MethodsEnum.GET, request: { url: 'test' } } as IActionNode;
    component.node = getNode;
    const mockError = {
      error: {
        message: 'test',
        title: 'error',
      },
    };
    apiExecutionSpy.executeNode.and.returnValue(throwError(mockError));

    component.executeNode();

    expect(apiExecutionSpy.executeNode).toHaveBeenCalledWith(getNode);
    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
