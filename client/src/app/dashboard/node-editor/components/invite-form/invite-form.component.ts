import { Component, Input, OnInit } from '@angular/core';
import { SurveysService } from '@app/dashboard/node-editor/services/surveys.service';
import { EmailConfigService } from '@app/dashboard/node-editor/services/email-config.service';
import { take } from 'rxjs';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { InsocialEmailInvitesConfiguration, InsocialSurvey } from '@app/shared/interfaces/invites/invite.interface';

/**
 * Component to display the invite form
 */
@Component({
  selector: 'app-invite-form',
  templateUrl: './invite-form.component.html',
  styleUrls: ['./invite-form.component.scss'],
})
export class InviteFormComponent implements OnInit {
  surveys: InsocialSurvey[];
  inviteConfig: InsocialEmailInvitesConfiguration;
  inviteForm: FormGroup;

  @Input() formGroupName: string;

  /**
   * Constructor for the invite form component
   * @param emailTemplateService - email template service
   * @param surveysService - surveys service
   * @param rootFormGroup - root form group
   */
  constructor(
    private emailTemplateService: EmailConfigService,
    private surveysService: SurveysService,
    private rootFormGroup: FormGroupDirective
  ) {}

  /**
   * Get the invite form group from the parent, initialize the surveys and invite configuration
   */
  ngOnInit(): void {
    this.inviteForm = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
    this.surveysService
      .getSurveyList()
      .pipe(take(1))
      .subscribe((surveys: InsocialSurvey[]) => {
        this.surveys = surveys;
      });
    this.emailTemplateService
      .getEmailInvitesConfiguration()
      .pipe(take(1))
      .subscribe((inviteConfig: InsocialEmailInvitesConfiguration) => {
        this.inviteConfig = inviteConfig;
      });
  }

  /**
   * Compare function for the surveys
   * @param survey1 - InsocialSurvey
   * @param survey2 - InsocialSurvey
   * @returns true if the surveys are equal, false otherwise
   */
  compareSurveys(survey1: InsocialSurvey, survey2: InsocialSurvey): boolean {
    return survey1 && survey2 ? survey1.id === survey2.id : survey1 === survey2;
  }
}
