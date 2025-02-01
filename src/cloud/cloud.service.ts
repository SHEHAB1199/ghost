import { Injectable } from '@nestjs/common';
import { CloudStrategy } from './strategies/cloud.interface';
import { AzureStrategy } from './strategies/azure.strategy';

@Injectable()
export class CloudService {
  private strategy: CloudStrategy;

  constructor() {
    this.strategy = new AzureStrategy();
  }

  async generateSASToken(filePath: string) {
    return { sasurl: await this.strategy.generateSASToken(filePath) };
  }
}
