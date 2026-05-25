export const inviteOrgAdminTemplate = (orgName: string, inviteUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Set up your organization</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          <tr>
            <td style="background-color: #4f46e5; padding: 40px 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Welcome to Our Platform</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="font-size: 16px; line-height: 24px; margin-top: 0; margin-bottom: 24px;">Hello,</p>
              <p style="font-size: 16px; line-height: 24px; margin-top: 0; margin-bottom: 24px;">You have been invited to set up the organization account for <strong>${orgName}</strong>.</p>
              <p style="font-size: 16px; line-height: 24px; margin-top: 0; margin-bottom: 32px;">Please click the button below to complete your registration, securely set your master password, and activate your organization dashboard.</p>
              
              <div style="text-align: center; margin-bottom: 32px;">
                <a href="${inviteUrl}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 16px;">Set up your account</a>
              </div>
              
              <p style="font-size: 14px; line-height: 20px; color: #64748b; margin-top: 0; margin-bottom: 0;">If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="font-size: 14px; line-height: 20px; color: #4f46e5; margin-top: 4px; margin-bottom: 0; word-break: break-all;">${inviteUrl}</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 40px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">This invitation link will expire in 24 hours.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
