import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  BaseImageProvider,
  ImageGenerationOptions,
  ImageGenerationResult,
} from './base.provider';

/**
 * Google Gemini 2.5 Flash Image Generation Provider
 * 文档: https://ai.google.dev/gemini-api/docs/image-generation?hl=zh-cn
 */
@Injectable()
export class GeminiProvider extends BaseImageProvider {
  readonly providerType = 'gemini';
  private readonly logger = new Logger(GeminiProvider.name);

  constructor(private readonly httpService: HttpService) {
    super();
  }

  async validateConfig(): Promise<boolean> {
    if (!this.config || !this.config.apiKey) {
      this.logger.warn('Gemini API key not configured');
      return false;
    }

    // 如果配置中设置了跳过验证，直接返回 true
    if (this.config.config?.skipValidation) {
      this.logger.log(
        `Skipping validation for config ${this.configId} (skipValidation enabled)`,
      );
      return true;
    }

    try {
      // 测试API连接 - 列出可用模型
      // 注意：第三方代理可能不支持此端点，可以在配置中设置 skipValidation: true
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.config.baseUrl}/models?key=${this.config.apiKey}`,
          {
            timeout: 5000,
          },
        ),
      );
      return response.status === 200;
    } catch (error) {
      this.logger.error(
        `Gemini validation failed for config ${this.configId}:`,
        error.message,
      );
      this.logger.warn(
        `If using a third-party proxy, consider adding "skipValidation": true to the config field`,
      );
      return false;
    }
  }

  async generateImage(
    prompt: string,
    options?: ImageGenerationOptions,
  ): Promise<ImageGenerationResult> {
    try {
      this.logger.log(
        `Generating image with Gemini 2.5 Flash (config ${this.configId}): ${prompt}`,
      );

      // 默认使用 Gemini 2.5 Flash Image Preview 模型
      const model =
        options?.model ||
        this.config.modelId ||
        'gemini-2.5-flash-image-preview';

      // 构建请求体，按照 generateContent API 格式
      const requestBody: any = {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      };

      // 打印请求信息用于调试
      this.logger.debug(
        'Gemini API Request URL:',
        `${this.config.baseUrl}/v1beta/models/${model}:generateContent`,
      );
      this.logger.debug(
        'Gemini API Request Body:',
        JSON.stringify(requestBody, null, 2),
      );

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.config.baseUrl}/v1beta/models/${model}:generateContent?key=${this.config.apiKey}`,
          requestBody,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 60000,
          },
        ),
      );

      // 打印完整响应用于调试
      // this.logger.debug(
      //   'Gemini API Response:',
      //   JSON.stringify(response.data, null, 2),
      // );

      // Gemini generateContent 返回格式:
      // {
      //   candidates: [{
      //     content: {
      //       parts: [
      //         { text: "..." },
      //         { inlineData: { mimeType: "image/png", data: "base64..." } }
      //       ]
      //     }
      //   }]
      // }
      const candidates = response.data.candidates;
      if (!candidates || candidates.length === 0) {
        this.logger.error(
          'No candidates in response. Full response:',
          JSON.stringify(response.data, null, 2),
        );
        throw new Error('No image generated');
      }

      // 从 parts 中提取图片数据
      const parts = candidates[0].content?.parts;
      if (!parts || parts.length === 0) {
        throw new Error('No parts in response');
      }

      // 查找包含图片的 part
      const imagePart = parts.find((part: any) => part.inlineData);
      if (!imagePart || !imagePart.inlineData) {
        this.logger.error(
          'No image data in response. Parts:',
          JSON.stringify(parts, null, 2),
        );
        throw new Error('No image data in response');
      }

      const imageBase64 = imagePart.inlineData.data;
      const mimeType = imagePart.inlineData.mimeType || 'image/png';

      return {
        success: true,
        imageBase64,
        provider: this.providerType,
        configId: this.configId,
        model,
        metadata: {
          mimeType,
        },
      };
    } catch (error) {
      this.logger.error('Gemini generation failed:', error);
      return {
        success: false,
        provider: this.providerType,
        configId: this.configId,
        error:
          error.response?.data?.error?.message ||
          error.message ||
          'Unknown error',
      };
    }
  }

  async inpaint(
    imageUrl: string,
    maskUrl: string,
    prompt: string,
    options?: ImageGenerationOptions,
  ): Promise<ImageGenerationResult> {
    try {
      this.logger.log(
        `Inpainting with Gemini Imagen (config ${this.configId}): ${prompt}`,
      );

      // 使用 Imagen 编辑模型
      const model =
        options?.model || this.config.modelId || 'imagen-3.0-capability-001';

      // 下载原图和遮罩
      const [imageBuffer, maskBuffer] = await Promise.all([
        this.downloadImage(imageUrl),
        this.downloadImage(maskUrl),
      ]);

      // 转换为 base64
      const imageBase64 = imageBuffer.toString('base64');
      const maskBase64 = maskBuffer.toString('base64');

      const requestBody: any = {
        instances: [
          {
            prompt: prompt,
            image: {
              bytesBase64Encoded: imageBase64,
            },
            mask: {
              image: {
                bytesBase64Encoded: maskBase64,
              },
            },
          },
        ],
        parameters: {
          sampleCount: 1,
          editMode: 'inpainting-insert',
        },
      };

      // 添加负面提示词
      if (options?.negativePrompt) {
        requestBody.instances[0].negativePrompt = options.negativePrompt;
      }

      if (options?.seed) {
        requestBody.parameters.seed = options.seed;
      }

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.config.baseUrl}/models/${model}:predict?key=${this.config.apiKey}`,
          requestBody,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 60000,
          },
        ),
      );

      const predictions = response.data.predictions;
      if (!predictions || predictions.length === 0) {
        throw new Error('No image generated');
      }

      const imageResultBase64 = predictions[0].bytesBase64Encoded;

      return {
        success: true,
        imageBase64: imageResultBase64,
        provider: this.providerType,
        configId: this.configId,
        model,
        metadata: {
          mimeType: predictions[0].mimeType || 'image/png',
          editMode: 'inpainting',
        },
      };
    } catch (error) {
      this.logger.error('Gemini inpainting failed:', error);
      return {
        success: false,
        provider: this.providerType,
        configId: this.configId,
        error:
          error.response?.data?.error?.message ||
          error.message ||
          'Unknown error',
      };
    }
  }

  /**
   * 下载图片为Buffer
   */
  private async downloadImage(url: string): Promise<Buffer> {
    const response = await firstValueFrom(
      this.httpService.get(url, {
        responseType: 'arraybuffer',
        timeout: 30000,
      }),
    );
    return Buffer.from(response.data);
  }
}
