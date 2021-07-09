import { HttpService, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  getHello(): string {
    return 'Welcome to Pjex Prod API!';
  }

  getInfo(): any {
    return {
      name: 'Pjex API',
      mode: 'Production mode',
      author: 'Milad Roghanian',
      contact: 'pjex@pjex.com',
      version: '1.0.0',
    };
  }
}
