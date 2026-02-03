# 环境变量配置

本项目使用 Zod 进行环境变量验证，确保应用启动时所有必需的环境变量都已正确配置。

## 文件结构

```
src/config/
├── env.validation.ts    # 环境变量 Schema 定义和验证函数
├── config.service.ts    # 类型安全的配置服务
├── config.module.ts     # 配置模块
└── example.usage.ts     # 使用示例
```

## 环境变量列表

### 必需的环境变量

| 变量名                   | 类型   | 说明                     | 示例值                                                    |
| ------------------------ | ------ | ------------------------ | --------------------------------------------------------- |
| `DATABASE_URL`           | string | PostgreSQL 数据库连接 URL | `postgresql://postgres:password@localhost:5432/yimei`     |
| `JWT_SECRET`             | string | JWT 密钥（至少 10 个字符）| `your-secret-key-change-this-in-production`               |
| `S3_ENDPOINT`            | string | S3 服务端点 URL          | `http://127.0.0.1:9000`                                   |
| `S3_BUCKET`              | string | S3 存储桶名称            | `yimei`                                                   |
| `AWS_ACCESS_KEY_ID`      | string | AWS 访问密钥 ID          | `rustfsadmin`                                             |
| `AWS_SECRET_ACCESS_KEY`  | string | AWS 访问密钥密码         | `rustfsadmin`                                             |

### 可选的环境变量（带默认值）

| 变量名          | 类型   | 默认值        | 说明                                      |
| --------------- | ------ | ------------- | ----------------------------------------- |
| `NODE_ENV`      | enum   | `development` | 运行环境：development/production/test/provision |
| `PORT`          | number | `3000`        | 应用监听端口（0-65535）                   |
| `JWT_EXPIRES_IN`| string | `7d`          | JWT 过期时间                              |
| `AWS_REGION`    | string | `us-east-1`   | AWS 区域                                  |

## 使用方法

### 1. 基本使用（使用 ConfigService）

在任何模块、服务或控制器中注入 `ConfigService`：

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './config/env.validation';

@Injectable()
export class YourService {
  constructor(
    private configService: ConfigService<EnvironmentVariables, true>
  ) {}

  someMethod() {
    const port = this.configService.get('PORT', { infer: true });
    const jwtSecret = this.configService.get('JWT_SECRET', { infer: true });
  }
}
```

### 2. 推荐使用（使用封装的 AppConfigService）

使用封装好的 `AppConfigService` 获得更好的类型提示和便捷的 getter 方法：

```typescript
import { Injectable } from '@nestjs/common';
import { AppConfigService } from './config/config.service';

@Injectable()
export class YourService {
  constructor(private appConfig: AppConfigService) {}

  someMethod() {
    // 直接使用 getter 方法
    const port = this.appConfig.port;
    const jwtSecret = this.appConfig.jwtSecret;

    // 获取 S3 配置对象
    const s3Config = this.appConfig.s3Config;
    console.log(s3Config.bucket, s3Config.endpoint);

    // 环境判断
    if (this.appConfig.isDevelopment) {
      console.log('开发环境');
    }
  }
}
```

### 3. 在 main.ts 中使用

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 获取配置服务
  const configService = app.get(AppConfigService);

  // 使用配置
  const port = configService.port;
  await app.listen(port);

  console.log(`应用运行在端口 ${port}`);
}
bootstrap();
```

## 验证机制

应用启动时会自动验证所有环境变量：

1. **类型验证**：确保变量类型正确（如 PORT 必须是数字）
2. **格式验证**：确保 URL、数字范围等格式正确
3. **必填验证**：确保所有必需的变量都已设置
4. **转换处理**：自动将字符串转换为正确的类型（如字符串 "3000" 转为数字 3000）

如果验证失败，应用会抛出详细的错误信息并拒绝启动。

## 添加新的环境变量

要添加新的环境变量，需要修改两个文件：

### 1. 更新 Schema 定义

在 [env.validation.ts](./env.validation.ts) 中添加新字段：

```typescript
const EnvironmentVariablesSchema = z.object({
  // 现有字段...

  // 添加新字段
  NEW_VARIABLE: z.string().min(1, 'NEW_VARIABLE 不能为空'),
});
```

### 2. 在配置服务中添加 Getter（可选）

在 [config.service.ts](./config.service.ts) 中添加便捷的 getter 方法：

```typescript
get newVariable(): string {
  return this.configService.get('NEW_VARIABLE', { infer: true });
}
```

## Zod Schema 常用验证方法

```typescript
// 字符串验证
z.string()                          // 基本字符串
z.string().min(10)                  // 最小长度
z.string().max(100)                 // 最大长度
z.string().email()                  // 邮箱格式
z.string().url()                    // URL 格式
z.string().default('默认值')        // 默认值

// 数字验证
z.number()                          // 基本数字
z.number().min(0)                   // 最小值
z.number().max(100)                 // 最大值
z.number().int()                    // 整数
z.number().positive()               // 正数

// 字符串转数字
z.string()
  .transform(val => parseInt(val, 10))
  .pipe(z.number().min(0).max(65535))

// 枚举
z.enum(['option1', 'option2'])

// 布尔值
z.boolean()
z.string().transform(val => val === 'true')  // 字符串转布尔

// 可选字段
z.string().optional()

// 联合类型
z.union([z.string(), z.number()])
```

## 特性

- ✅ **类型安全**：完整的 TypeScript 类型推断
- ✅ **启动时验证**：确保配置正确再启动应用
- ✅ **详细错误信息**：验证失败时提供清晰的错误提示
- ✅ **自动类型转换**：字符串自动转换为数字、布尔值等
- ✅ **全局可用**：通过 `@Global()` 装饰器在整个应用中可用
- ✅ **支持变量扩展**：支持 `${VAR}` 语法引用其他变量

## 参考资料

- [NestJS Configuration 文档](https://docs.nestjs.com/techniques/configuration)
- [Zod 文档](https://zod.dev/)
- [nestjs-zod 文档](https://github.com/risenforces/nestjs-zod)
