import { Injectable } from '@nestjs/common';
import {
  BaseImageProvider,
  ImageGenerationOptions,
  ImageGenerationResult,
} from './base.provider';

@Injectable()
export class GeminiProvider extends BaseImageProvider {
  providerType: string;
  generateImage(
    prompt: string,
    options?: ImageGenerationOptions,
  ): Promise<ImageGenerationResult> {
    throw new Error('Method not implemented.');
  }
  inpaint(
    imageUrl: string,
    maskUrl: string,
    prompt: string,
    options?: ImageGenerationOptions,
  ): Promise<ImageGenerationResult> {
    throw new Error('Method not implemented.');
  }
  validateConfig(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
