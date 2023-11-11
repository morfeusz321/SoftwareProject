import { Injectable } from '@angular/core';
import { ApiService } from '@app/shared/services/api-service/api.service';
import { environment } from '@env/environment';
import { map, Observable } from 'rxjs';
import { InsocialEmailInvitesConfiguration } from '@app/shared/interfaces/invites/invite.interface';

/**
 * Service to retrieve email-form templates from the Insocial API
 */
@Injectable({
  providedIn: 'root',
})
export class EmailConfigService {
  private readonly insocialApiUrl = environment.insocialApiUrl;
  private readonly customerId = environment.customerId;
  private readonly apiToken = environment.apiToken;

  /**
   * Constructor for the email-form template service
   * @param apiService - api service
   */
  constructor(private apiService: ApiService) {}

  /**
   * Get the email-form invites configuration from the Insocial API
   * @returns Observable of the email-form invites configuration
   */
  getEmailInvitesConfiguration(): Observable<InsocialEmailInvitesConfiguration> {
    return this.apiService
      .get<InsocialEmailInvitesConfiguration>(
        `${this.insocialApiUrl}/customers/${this.customerId}`,
        {},
        { ['X-Auth-Token']: this.apiToken }
      )
      .pipe(map((res: any) => res.invitesConfiguration?.emailConfiguration));
  }
}
