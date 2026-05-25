import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { inviteOrgAdminTemplate } from './templates/inviteOrgAdmin';
import { inviteStaffTemplate } from './templates/inviteStaff';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(MailService.name);
  private readonly frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  private readonly defaultFrom = process.env.MAIL_FROM || 'onboarding@resend.dev'; // Use resend's default dev sandbox email

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
  }

  async sendOrgAdminInvite(email: string, orgName: string, token: string) {
    const inviteUrl = `${this.frontendUrl}/account/setup?token=${token}`;
    
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.defaultFrom,
        to: email,
        subject: `Set up your organization: ${orgName}`,
        html: inviteOrgAdminTemplate(orgName, inviteUrl),
      });

      if (error) {
        this.logger.error(`Failed to send Org Admin invite to ${email}`, error);
      } else {
        this.logger.log(`Successfully sent Org Admin invite to ${email}. ID: ${data?.id}`);
      }
    } catch (err) {
      this.logger.error(`Exception caught sending Org Admin invite to ${email}`, err);
    }
  }

  async sendStaffInvite(email: string, orgName: string, role: string, token: string) {
    const inviteUrl = `${this.frontendUrl}/account/staff-setup?token=${token}`;
    
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.defaultFrom,
        to: email,
        subject: `You've been invited to join ${orgName}`,
        html: inviteStaffTemplate(orgName, role, inviteUrl),
      });

      if (error) {
        this.logger.error(`Failed to send Staff invite to ${email}`, error);
      } else {
        this.logger.log(`Successfully sent Staff invite to ${email}. ID: ${data?.id}`);
      }
    } catch (err) {
      this.logger.error(`Exception caught sending Staff invite to ${email}`, err);
    }
  }
}
