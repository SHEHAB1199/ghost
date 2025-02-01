import { Injectable } from '@nestjs/common';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from '@azure/storage-blob';
import { CatchError } from 'decorators/CatchError.decorator';
import { CloudStrategy } from './cloud.interface';

@Injectable()
export class AzureStrategy implements CloudStrategy {
  private blobServiceClient: BlobServiceClient;
  private containerName: string;

  constructor() {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    this.containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

    const credentials = new StorageSharedKeyCredential(accountName, accountKey);
    this.blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      credentials,
    );
  }

  @CatchError()
  async generateSASToken(blobName: string) {
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );
    const blobClient = containerClient.getBlobClient(blobName);

    const permissions = new BlobSASPermissions();
    permissions.write = true;
    permissions.create = true;

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: this.containerName,
        blobName: blobName,
        permissions: permissions,
        expiresOn: new Date(new Date().valueOf() + 3600 * 1000),
      },
      this.blobServiceClient.credential as StorageSharedKeyCredential,
    );

    return `${blobClient.url}?${sasToken}`;
  }
}
