import { Injectable } from '@nestjs/common';
import { AppConfigService } from './config.service';

/**
 * 使用配置服务的示例
 *
 * 在任何 Service 或 Controller 中注入 AppConfigService 即可使用
 */
@Injectable()
export class ExampleService {
  constructor(private readonly appConfig: AppConfigService) {
    // 使用配置服务获取环境变量
    console.log(`应用运行在端口: ${this.appConfig.port}`);
    console.log(`当前环境: ${this.appConfig.nodeEnv}`);
    console.log(`是否为生产环境: ${this.appConfig.isProduction}`);
  }

  someMethod() {
    // 获取 JWT 配置
    const jwtSecret = this.appConfig.jwtSecret;
    const jwtExpiresIn = this.appConfig.jwtExpiresIn;

    // 获取 S3 配置
    const s3Config = this.appConfig.s3Config;
    console.log(`S3 Bucket: ${s3Config.bucket}`);

    // 根据环境执行不同逻辑
    if (this.appConfig.isDevelopment) {
      console.log('开发环境特定逻辑');
    }
  }
}
