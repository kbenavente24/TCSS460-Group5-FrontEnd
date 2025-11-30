import { credentialsService } from 'utils/axios';

export const authApi = {
  login: (credentials: { email: string; password: string }) => credentialsService.post('/auth/login', credentials),

  register: (data: { email: string; password: string; firstname: string; lastname: string; username: string; phone: string }) =>
    credentialsService.post('/auth/register', data),

  sendEmailVerification: () => credentialsService.post('/auth/verify/email/send'),

  requestPasswordReset: (data: { email: string }) => credentialsService.post('/auth/password/reset-request', data),

  resetPasswordWithToken: (data: { token: string; password: string }) => credentialsService.post('/auth/password/reset', data),

  changePassword: (data: { oldPassword: string; newPassword: string }) => credentialsService.post('/auth/user/password/change', data)
};
