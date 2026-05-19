import { Controller } from '@nestjs/common';
import { API_ROUTES } from '../../../shared/routes';

@Controller(API_ROUTES.AUTH.BASE)
export class AuthController {}
