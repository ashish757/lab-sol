import { getClientApiPath } from '../../../shared/routes.config';
import { API_ENDPOINTS } from '../config/routesConfig';

export function getDownloadDailyReportUrl(id?: string): string {
  const base = 'http://localhost:3000';
  if (id && id !== 'new') {
    return `${base}${getClientApiPath.reports.downloadOne(id)}`;
  }
  return `${base}${API_ENDPOINTS.DOWNLOAD_DAILY_REPORT}`;
}
