import { InviteFormComponent } from '@app/dashboard/node-editor/components/invite-form/invite-form.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EmailConfigService } from '@app/dashboard/node-editor/services/email-config.service';
import { SurveysService } from '@app/dashboard/node-editor/services/surveys.service';
import { FormBuilder, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule} from '@angular/material/form-field';
import { of } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';

describe('InviteFormComponent', () => {
  let component: InviteFormComponent;
  let fixture: ComponentFixture<InviteFormComponent>;
  let emailConfigServiceMocked: jasmine.SpyObj<EmailConfigService>;
  let surveysServiceMocked: jasmine.SpyObj<SurveysService>;

  beforeEach(waitForAsync(() => {
    const fb = new FormBuilder()

    const formGroupDirective = new FormGroupDirective([], []);
    formGroupDirective.form = fb.group({
      test: fb.group({
        surveyId: ['', Validators.required],
        template: ['', Validators.required],
        subject: ['', Validators.required],
        fromName: ['', Validators.required],
        fromEmail: ['', Validators.required],
      })
    });

    const emailConfigServiceMock = jasmine.createSpyObj('EmailConfigService', ['getEmailInvitesConfiguration']);

    const surveysServiceMock = jasmine.createSpyObj('SurveysService', ['getSurveyList']);

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule
      ],
        declarations: [InviteFormComponent],
      providers: [
        { provide: EmailConfigService, useValue: emailConfigServiceMock },
        { provide: SurveysService, useValue: surveysServiceMock },
        { provide: FormGroupDirective, useValue: formGroupDirective}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    surveysServiceMocked = TestBed.inject(SurveysService) as jasmine.SpyObj<SurveysService>;
    emailConfigServiceMocked = TestBed.inject(EmailConfigService) as jasmine.SpyObj<EmailConfigService>;
    surveysServiceMocked.getSurveyList.and.returnValue(of([]));
    emailConfigServiceMocked.getEmailInvitesConfiguration.and.returnValue(of({} as any));

    fixture = TestBed.createComponent(InviteFormComponent);
    component = fixture.componentInstance;
    component.formGroupName = 'test';
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
