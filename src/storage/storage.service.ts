import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { extname } from 'path';
 
import { envs } from '../config/envs';
 
@Injectable()
export class StorageService {
  private readonly s3: S3Client;
 
  constructor() {
    this.s3 = new S3Client({
      region: envs.awsRegion,
      credentials: {
        accessKeyId: envs.awsAccessKeyId,
        secretAccessKey: envs.awsSecretAccessKey,
      },
    });
  }
 
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
    const extension = extname(file.originalname).toLowerCase();
    const key = `${cleanFolder}/${Date.now()}-${randomUUID()}${extension}`;
 
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: envs.awsBucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'No se pudo subir el archivo a S3',
      );
    }
 
    return `https://${envs.awsBucketName}.s3.${envs.awsRegion}.amazonaws.com/${key}`;
  }
}