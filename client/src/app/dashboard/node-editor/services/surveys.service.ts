import { Injectable } from '@angular/core';
import { ApiService } from '@app/shared/services/api-service/api.service';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { InsocialSurvey } from '@app/shared/interfaces/invites/invite.interface';

/**
 * Service to retrieve surveys from the Insocial API
 */
@Injectable({
  providedIn: 'root',
})
export class SurveysService {
  private readonly insocialApiUrl = environment.insocialApiUrl;
  private readonly customerId = environment.customerId;
  private readonly apiToken = environment.apiToken;

  /**
   * Constructor for the surveys service
   * @param apiService
   */
  constructor(private apiService: ApiService) {}

  /**
   * Get the surveys from the Insocial API
   * @returns Observable of the surveys
   */
  getSurveyList(): Observable<InsocialSurvey[]> {
    return this.apiService
      .get<InsocialSurvey[]>(
        `${this.insocialApiUrl}/customers/${this.customerId}/surveys`,
        { limit: 500 },
        { ['X-Auth-Token']: this.apiToken }
      )
      .pipe(
        map((res: any) => res.data),
        map((surveys: any) => surveys.map((survey: any) => ({ id: survey.id.toString(), label: survey.label })))
      );
  }
}
