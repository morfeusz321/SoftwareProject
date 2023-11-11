import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiGraphListService } from '@app/dashboard/graph-editor/services/graph-list-api-service/graph-list-api-service';
import { IGraph } from '@app/shared/interfaces/graph/graph.interface';
import { take } from 'rxjs';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { UuidService } from '@app/shared/services/uuid-generator/uuid.service';
import { ConditionalTypeEnum } from '@app/shared/enums/conditional-type.enum';
import { ITriggerNode } from '@app/shared/interfaces/node/node.interface';

/**
 * Component to display the new graph input
 */
@Component({
  selector: 'app-new-graph-input',
  templateUrl: './new-graph-input.component.html',
  styleUrls: ['./new-graph-input.component.scss'],
})
export class NewGraphInputComponent {
  nameForm: FormGroup = this.fb.group({
    name: new FormControl('', Validators.required),
  });

  /**
   * Constructor
   * @param fb - form builder
   * @param graphListApiService - graph list api service
   * @param router - router
   * @param uuid - uuid service
   */
  constructor(
    private fb: FormBuilder,
    private graphListApiService: ApiGraphListService,
    private router: Router,
    private uuid: UuidService
  ) {}

  /**
   * Creates a new graph
   */
  createGraph(): void {
    const graph = {
      id: 0,
      name: this.nameForm.controls['name'].value,
      userId: environment.userId,
      nodes: [
        {
          id: this.uuid.generateUUID(),
          name: 'START',
          neighbours: [],
          position: { positionX: 600, positionY: 100, positionZ: 0 },
          type: ConditionalTypeEnum.TRIGGER,
          schedule: '',
        } as ITriggerNode,
      ],
      isActive: false,
      isDraft: false,
      schedule: null,
    } as IGraph;
    this.graphListApiService
      .createGraph(graph)
      .pipe(take(1))
      .subscribe((res) => {
        this.router.navigate(['/builder', { id: res.id }]);
      });
  }
}
