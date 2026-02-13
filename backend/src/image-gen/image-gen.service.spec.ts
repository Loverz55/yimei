import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { getQueueToken } from '@nestjs/bullmq';
import { ImageGenService } from './image-gen.service';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { AiProviderService } from '../ai-provider/ai-provider.service';
import { QUEUE_NAMES } from '../queue/constants';
import { GenerateImageDto, InpaintImageDto } from './dto/generate-image.dto';

describe('ImageGenService', () => {
  let service: ImageGenService;
  let prismaService: PrismaService;
  let uploadService: UploadService;
  let aiProviderService: AiProviderService;
  let imageQueue: Queue;

  const mockUser = { id: 1 };
  const mockFile = {
    id: 1,
    key: 'test-key',
    contentType: 'image/png',
    status: 'uploaded',
    userId: 1,
  };

  const mockProvider = {
    generateImage: vi.fn(),
    inpaint: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageGenService,
        {
          provide: PrismaService,
          useValue: {
            imageGeneration: {
              create: vi.fn(),
              findMany: vi.fn(),
              findFirst: vi.fn(),
            },
            file: {
              create: vi.fn(),
              findUnique: vi.fn(),
            },
            medicalAesthetics: {
              findMany: vi.fn(),
            },
          },
        },
        {
          provide: UploadService,
          useValue: {
            uploadBuffer: vi.fn(),
            getFileUrl: vi.fn(),
          },
        },
        {
          provide: AiProviderService,
          useValue: {
            getImageGenProvider: vi.fn().mockReturnValue(mockProvider),
            selectImageGenProvider: vi.fn().mockResolvedValue(mockProvider),
            getAvailableProviders: vi.fn(),
            reloadProviders: vi.fn(),
          },
        },
        {
          provide: getQueueToken(QUEUE_NAMES.IMAGE_GENERATION),
          useValue: {
            add: vi.fn(),
            getJob: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ImageGenService>(ImageGenService);
    prismaService = module.get<PrismaService>(PrismaService);
    uploadService = module.get<UploadService>(UploadService);
    aiProviderService = module.get<AiProviderService>(AiProviderService);
    imageQueue = module.get<Queue>(getQueueToken(QUEUE_NAMES.IMAGE_GENERATION));

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateImage', () => {
    const generateDto: GenerateImageDto = {
      prompt: 'a beautiful landscape',
      width: 1024,
      height: 1024,
    };

    it('should submit image generation job to queue', async () => {
      const mockJob = {
        id: 'job-123',
        timestamp: Date.now(),
      };

      vi.spyOn(imageQueue, 'add').mockResolvedValue(mockJob as any);

      const result = await service.generateImage(generateDto, mockUser.id);

      expect(result).toEqual({
        jobId: 'job-123',
        message: '图片生成任务已提交，请使用 jobId 查询任务状态',
      });
      expect(imageQueue.add).toHaveBeenCalledWith(
        'generate-image',
        {
          type: 'generate',
          userId: mockUser.id,
          dto: generateDto,
        },
        {
          removeOnComplete: { age: 300, count: 100 },
          removeOnFail: false,
        },
      );
    });
  });

  describe('generateImageInternal', () => {
    const generateDto: GenerateImageDto = {
      prompt: 'a beautiful landscape',
      width: 1024,
      height: 1024,
    };

    it('should generate image successfully with base64 response', async () => {
      const mockResult = {
        success: true,
        imageBase64: 'base64-encoded-image',
        provider: 'test-provider',
        model: 'test-model',
        cost: 0.1,
        metadata: {},
      };

      mockProvider.generateImage.mockResolvedValue(mockResult);

      vi.spyOn(uploadService, 'uploadBuffer').mockResolvedValue({
        url: 'https://example.com/image.png',
        fileId: 1,
      } as any);

      vi.spyOn(prismaService.imageGeneration, 'create').mockResolvedValue({
        id: 1,
        userId: mockUser.id,
        fileId: 1,
        createdAt: new Date(),
      } as any);

      const result = await service.generateImageInternal(
        generateDto,
        mockUser.id,
      );

      expect(result).toMatchObject({
        id: 1,
        imageUrl: 'https://example.com/image.png',
        provider: 'test-provider',
        model: 'test-model',
      });
      expect(mockProvider.generateImage).toHaveBeenCalled();
      expect(uploadService.uploadBuffer).toHaveBeenCalled();
    });

    it('should throw BadRequestException when generation fails', async () => {
      const mockResult = {
        success: false,
        error: 'Generation failed',
      };

      mockProvider.generateImage.mockResolvedValue(mockResult);

      await expect(
        service.generateImageInternal(generateDto, mockUser.id),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle prompt injection', async () => {
      const dtoWithInjection: GenerateImageDto = {
        ...generateDto,
        promptInjectIds: [1, 2],
        promptInjectPosition: 'prepend',
      };

      vi.spyOn(prismaService.medicalAesthetics, 'findMany').mockResolvedValue([
        { id: 1, prompt: 'injected prompt 1' },
        { id: 2, prompt: 'injected prompt 2' },
      ] as any);

      const mockResult = {
        success: true,
        imageUrl: 'https://example.com/image.png',
        provider: 'test-provider',
        model: 'test-model',
        cost: 0.1,
        metadata: {},
      };

      mockProvider.generateImage.mockResolvedValue(mockResult);

      vi.spyOn(prismaService.file, 'create').mockResolvedValue(mockFile as any);
      vi.spyOn(prismaService.imageGeneration, 'create').mockResolvedValue({
        id: 1,
        userId: mockUser.id,
        fileId: 1,
        file: mockFile,
        createdAt: new Date(),
      } as any);

      await service.generateImageInternal(dtoWithInjection, mockUser.id);

      expect(prismaService.medicalAesthetics.findMany).toHaveBeenCalledWith({
        where: { id: { in: [1, 2] } },
        select: { id: true, prompt: true },
      });
    });
  });

  describe('inpaint', () => {
    const inpaintDto: InpaintImageDto = {
      imageId: 1,
      maskId: 2,
      prompt: 'change the color',
    };

    it('should submit inpaint job to queue', async () => {
      const mockJob = {
        id: 'job-456',
        timestamp: Date.now(),
      };

      vi.spyOn(imageQueue, 'add').mockResolvedValue(mockJob as any);

      const result = await service.inpaint(inpaintDto, mockUser.id);

      expect(result).toEqual({
        jobId: 'job-456',
        message: '图片局部重绘任务已提交，请使用 jobId 查询任务状态',
      });
      expect(imageQueue.add).toHaveBeenCalledWith(
        'inpaint-image',
        {
          type: 'inpaint',
          userId: mockUser.id,
          dto: inpaintDto,
        },
        {
          removeOnComplete: { age: 300, count: 100 },
          removeOnFail: false,
        },
      );
    });
  });

  describe('getUserGenerations', () => {
    it('should return user generations with pagination', async () => {
      const mockGenerations = [
        {
          id: 1,
          userId: mockUser.id,
          file: mockFile,
          createdAt: new Date(),
        },
      ];

      vi.spyOn(prismaService.imageGeneration, 'findMany').mockResolvedValue(
        mockGenerations as any,
      );

      const result = await service.getUserGenerations(mockUser.id, 20, 0);

      expect(result).toEqual(mockGenerations);
      expect(prismaService.imageGeneration.findMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        include: { file: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
        skip: 0,
      });
    });
  });

  describe('getGenerationById', () => {
    it('should return generation by id', async () => {
      const mockGeneration = {
        id: 1,
        userId: mockUser.id,
        file: mockFile,
      };

      vi.spyOn(prismaService.imageGeneration, 'findFirst').mockResolvedValue(
        mockGeneration as any,
      );

      const result = await service.getGenerationById(1, mockUser.id);

      expect(result).toEqual(mockGeneration);
      expect(prismaService.imageGeneration.findFirst).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
        include: { file: true },
      });
    });

    it('should throw NotFoundException when generation not found', async () => {
      vi.spyOn(prismaService.imageGeneration, 'findFirst').mockResolvedValue(
        null,
      );

      await expect(service.getGenerationById(999, mockUser.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getJobStatus', () => {
    it('should return job status', async () => {
      const mockJob = {
        id: 'job-123',
        timestamp: Date.now(),
        processedOn: Date.now(),
        finishedOn: Date.now(),
        progress: 100,
        returnvalue: { result: 'success' },
        failedReason: null,
        getState: vi.fn().mockResolvedValue('completed'),
      };

      vi.spyOn(imageQueue, 'getJob').mockResolvedValue(mockJob as any);

      const result = await service.getJobStatus('job-123');

      expect(result).toMatchObject({
        jobId: 'job-123',
        status: 'completed',
        progress: 100,
        result: { result: 'success' },
      });
    });

    it('should throw NotFoundException when job not found', async () => {
      vi.spyOn(imageQueue, 'getJob').mockResolvedValue(null);

      await expect(service.getJobStatus('invalid-job')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('cancelJob', () => {
    it('should cancel a pending job', async () => {
      const mockJob = {
        id: 'job-123',
        getState: vi.fn().mockResolvedValue('waiting'),
        remove: vi.fn().mockResolvedValue(true),
      };

      vi.spyOn(imageQueue, 'getJob').mockResolvedValue(mockJob as any);

      const result = await service.cancelJob('job-123');

      expect(result).toEqual({
        message: '任务已取消',
        jobId: 'job-123',
      });
      expect(mockJob.remove).toHaveBeenCalled();
    });

    it('should throw BadRequestException when trying to cancel completed job', async () => {
      const mockJob = {
        id: 'job-123',
        getState: vi.fn().mockResolvedValue('completed'),
      };

      vi.spyOn(imageQueue, 'getJob').mockResolvedValue(mockJob as any);

      await expect(service.cancelJob('job-123')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getAvailableProviders', () => {
    it('should return available providers', async () => {
      const mockProviders = [
        { id: 1, name: 'Provider 1' },
        { id: 2, name: 'Provider 2' },
      ];

      vi.spyOn(aiProviderService, 'getAvailableProviders').mockResolvedValue(
        mockProviders as any,
      );

      const result = await service.getAvailableProviders();

      expect(result).toEqual(mockProviders);
      expect(aiProviderService.getAvailableProviders).toHaveBeenCalledWith(
        'image-gen',
      );
    });
  });

  describe('reloadProviders', () => {
    it('should reload providers', async () => {
      const mockResult = { count: 3 };

      vi.spyOn(aiProviderService, 'reloadProviders').mockResolvedValue(
        mockResult as any,
      );

      const result = await service.reloadProviders();

      expect(result).toEqual(mockResult);
      expect(aiProviderService.reloadProviders).toHaveBeenCalled();
    });
  });

  describe('Concurrency Simulation', () => {
    const makeGenerateDto = (index: number): GenerateImageDto => ({
      prompt: `landscape ${index}`,
      width: 1024,
      height: 1024,
      promptInjectPosition: 'prepend',
      provider: 'auto',
      samples: 1,
    });

    /**
     * 模拟多个用户同时提交任务到队列
     */
    it('should handle multiple concurrent queue submissions', async () => {
      let jobCounter = 0;
      vi.spyOn(imageQueue, 'add').mockImplementation(async () => {
        jobCounter++;
        return { id: `job-${jobCounter}`, timestamp: Date.now() } as any;
      });

      // 10 个用户同时提交任务
      const submissions = Array.from({ length: 10 }, (_, i) =>
        service.generateImage(makeGenerateDto(i), i + 1),
      );

      const results = await Promise.all(submissions);

      // 所有任务都应该成功提交
      expect(results).toHaveLength(10);
      results.forEach((result, i) => {
        expect(result.jobId).toBe(`job-${i + 1}`);
        expect(result.message).toContain('图片生成任务已提交');
      });

      // 队列 add 应被调用 10 次
      expect(imageQueue.add).toHaveBeenCalledTimes(10);
    });

    /**
     * 模拟处理器并发执行 generateImageInternal
     * 展示当 concurrency=5 时，5 个任务同时跑的情况
     */
    it('should process multiple generateImageInternal calls concurrently', async () => {
      const executionLog: { userId: number; event: string; time: number }[] = [];
      const startTime = Date.now();

      // 模拟 provider.generateImage 需要一定时间完成
      mockProvider.generateImage.mockImplementation(async (prompt: string) => {
        const userId = parseInt(prompt.split(' ')[1]);
        executionLog.push({ userId, event: 'gen-start', time: Date.now() - startTime });
        // 模拟耗时操作
        await new Promise((resolve) => setTimeout(resolve, 50));
        executionLog.push({ userId, event: 'gen-end', time: Date.now() - startTime });
        return {
          success: true,
          imageBase64: 'base64-data',
          provider: 'test-provider',
          model: 'test-model',
          cost: 0.1,
          metadata: {},
        };
      });

      vi.spyOn(uploadService, 'uploadBuffer').mockResolvedValue({
        url: 'https://example.com/image.png',
        fileId: 1,
      } as any);

      let createCounter = 0;
      (prismaService.imageGeneration.create as any).mockImplementation(
        async () => {
          createCounter++;
          return {
            id: createCounter,
            userId: 1,
            fileId: 1,
            createdAt: new Date(),
          };
        },
      );

      // 并发调用 5 个 generateImageInternal（模拟 processor concurrency=5）
      const concurrentTasks = Array.from({ length: 5 }, (_, i) =>
        service.generateImageInternal(makeGenerateDto(i), i + 1),
      );

      const results = await Promise.all(concurrentTasks);

      // 所有任务都应该成功完成
      expect(results).toHaveLength(5);
      results.forEach((result) => {
        expect(result.imageUrl).toBe('https://example.com/image.png');
        expect(result.provider).toBe('test-provider');
      });

      // 验证并发执行：检查存在时间重叠的任务
      const starts = executionLog.filter((e) => e.event === 'gen-start');
      const ends = executionLog.filter((e) => e.event === 'gen-end');

      // 所有 5 个任务都应该有 start 和 end
      expect(starts).toHaveLength(5);
      expect(ends).toHaveLength(5);

      // 并发场景下，有些任务的 start 应该在其他任务 end 之前
      // 即最后一个 start 的时间 < 第一个 end 的时间（说明并发执行了）
      const lastStartTime = Math.max(...starts.map((s) => s.time));
      const firstEndTime = Math.min(...ends.map((e) => e.time));
      expect(lastStartTime).toBeLessThanOrEqual(firstEndTime);
    });

    /**
     * 模拟并发任务中部分失败的情况
     */
    it('should handle mixed success and failure in concurrent tasks', async () => {
      let callCount = 0;
      mockProvider.generateImage.mockImplementation(async () => {
        callCount++;
        // 第 2、4 个任务失败
        if (callCount === 2 || callCount === 4) {
          return { success: false, error: `Task ${callCount} failed` };
        }
        return {
          success: true,
          imageBase64: 'base64-data',
          provider: 'test-provider',
          model: 'test-model',
          cost: 0.1,
          metadata: {},
        };
      });

      vi.spyOn(uploadService, 'uploadBuffer').mockResolvedValue({
        url: 'https://example.com/image.png',
        fileId: 1,
      } as any);

      let createId = 0;
      (prismaService.imageGeneration.create as any).mockImplementation(
        async () => {
          createId++;
          return {
            id: createId,
            userId: 1,
            fileId: 1,
            createdAt: new Date(),
          } as any;
        },
      );

      // 5 个并发任务
      const tasks = Array.from({ length: 5 }, (_, i) =>
        service
          .generateImageInternal(makeGenerateDto(i), i + 1)
          .then((result) => ({ status: 'fulfilled' as const, value: result }))
          .catch((error) => ({ status: 'rejected' as const, reason: error })),
      );

      const results = await Promise.all(tasks);

      const succeeded = results.filter((r) => r.status === 'fulfilled');
      const failed = results.filter((r) => r.status === 'rejected');

      // 3 个成功，2 个失败
      expect(succeeded).toHaveLength(3);
      expect(failed).toHaveLength(2);

      // 失败的任务应该抛出 BadRequestException
      failed.forEach((f) => {
        expect(f.status === 'rejected' && f.reason).toBeInstanceOf(
          BadRequestException,
        );
      });
    });

    /**
     * 模拟并发进度追踪：多个任务各自独立报告进度
     */
    it('should track progress independently for concurrent tasks', async () => {
      const progressMap = new Map<number, number[]>();

      mockProvider.generateImage.mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 30));
        return {
          success: true,
          imageBase64: 'base64-data',
          provider: 'test-provider',
          model: 'test-model',
          cost: 0.1,
          metadata: {},
        };
      });

      vi.spyOn(uploadService, 'uploadBuffer').mockResolvedValue({
        url: 'https://example.com/image.png',
        fileId: 1,
      } as any);

      let createId = 0;
      (prismaService.imageGeneration.create as any).mockImplementation(
        async () => {
          createId++;
          return {
            id: createId,
            userId: 1,
            fileId: 1,
            createdAt: new Date(),
          } as any;
        },
      );

      // 3 个并发任务，每个都有独立的 progressCallback
      const tasks = Array.from({ length: 3 }, (_, i) => {
        const userId = i + 1;
        progressMap.set(userId, []);

        return service.generateImageInternal(
          makeGenerateDto(i),
          userId,
          async (progress: number) => {
            progressMap.get(userId)!.push(progress);
          },
        );
      });

      await Promise.all(tasks);

      // 每个任务都应该报告自己的进度序列
      for (const [userId, progresses] of progressMap.entries()) {
        // 进度应该包含：20, 30, 70, 80, 90
        expect(progresses).toEqual([20, 30, 70, 80, 90]);
      }

      // 确认 3 个任务的进度互不干扰
      expect(progressMap.size).toBe(3);
    });

    /**
     * 模拟并发提交 + 查询状态的竞争场景
     */
    it('should handle concurrent submission and status polling', async () => {
      const jobStore = new Map<string, { state: string; progress: number }>();

      vi.spyOn(imageQueue, 'add').mockImplementation(async (name, data) => {
        const jobId = `job-${jobStore.size + 1}`;
        jobStore.set(jobId, { state: 'waiting', progress: 0 });

        // 模拟任务状态异步变更
        setTimeout(() => {
          const job = jobStore.get(jobId);
          if (job) {
            job.state = 'active';
            job.progress = 50;
          }
        }, 10);
        setTimeout(() => {
          const job = jobStore.get(jobId);
          if (job) {
            job.state = 'completed';
            job.progress = 100;
          }
        }, 30);

        return { id: jobId, timestamp: Date.now() } as any;
      });

      vi.spyOn(imageQueue, 'getJob').mockImplementation(async (jobId: string) => {
        const job = jobStore.get(jobId);
        if (!job) return null;
        return {
          id: jobId,
          timestamp: Date.now(),
          processedOn: Date.now(),
          finishedOn: job.state === 'completed' ? Date.now() : null,
          progress: job.progress,
          returnvalue: job.state === 'completed' ? { success: true } : null,
          failedReason: null,
          getState: vi.fn().mockResolvedValue(job.state),
        } as any;
      });

      // 先提交 3 个任务
      const submissions = await Promise.all(
        Array.from({ length: 3 }, (_, i) =>
          service.generateImage(makeGenerateDto(i), i + 1),
        ),
      );

      // 立即查询所有任务状态（此时任务可能是 waiting 或 active）
      const immediateStatuses = await Promise.all(
        submissions.map((s) => service.getJobStatus(s.jobId)),
      );

      immediateStatuses.forEach((status) => {
        expect(['waiting', 'active']).toContain(status.status);
      });

      // 等待任务完成后再查询
      await new Promise((resolve) => setTimeout(resolve, 50));

      const finalStatuses = await Promise.all(
        submissions.map((s) => service.getJobStatus(s.jobId)),
      );

      finalStatuses.forEach((status) => {
        expect(status.status).toBe('completed');
        expect(status.progress).toBe(100);
      });
    });

    /**
     * 模拟超过并发限制的场景（超过5个同时处理）
     * 验证任务排队机制
     */
    it('should queue tasks beyond concurrency limit', async () => {
      const activeTasks = new Set<string>();
      let maxConcurrent = 0;
      const CONCURRENCY_LIMIT = 5;

      mockProvider.generateImage.mockImplementation(async (prompt: string) => {
        activeTasks.add(prompt);
        maxConcurrent = Math.max(maxConcurrent, activeTasks.size);

        // 模拟工作耗时
        await new Promise((resolve) => setTimeout(resolve, 30));

        activeTasks.delete(prompt);
        return {
          success: true,
          imageBase64: 'base64-data',
          provider: 'test-provider',
          model: 'test-model',
          cost: 0.1,
          metadata: {},
        };
      });

      vi.spyOn(uploadService, 'uploadBuffer').mockResolvedValue({
        url: 'https://example.com/image.png',
        fileId: 1,
      } as any);

      let createId = 0;
      (prismaService.imageGeneration.create as any).mockImplementation(
        async () => {
          createId++;
          return {
            id: createId,
            userId: 1,
            fileId: 1,
            createdAt: new Date(),
          } as any;
        },
      );

      // 提交 10 个任务，但模拟 concurrency=5 的限制
      // 用简单的信号量模拟 BullMQ 的并发控制
      const semaphore = {
        count: 0,
        max: CONCURRENCY_LIMIT,
        queue: [] as (() => void)[],
        async acquire() {
          if (this.count < this.max) {
            this.count++;
            return;
          }
          await new Promise<void>((resolve) => this.queue.push(resolve));
          this.count++;
        },
        release() {
          this.count--;
          const next = this.queue.shift();
          if (next) next();
        },
      };

      const processWithLimit = async (index: number) => {
        await semaphore.acquire();
        try {
          return await service.generateImageInternal(
            makeGenerateDto(index),
            index + 1,
          );
        } finally {
          semaphore.release();
        }
      };

      const tasks = Array.from({ length: 10 }, (_, i) => processWithLimit(i));
      const results = await Promise.all(tasks);

      // 所有 10 个任务都应该成功
      expect(results).toHaveLength(10);

      // 验证：任何时刻最多只有 5 个任务在同时执行
      expect(maxConcurrent).toBeLessThanOrEqual(CONCURRENCY_LIMIT);
      // 确认确实有并发（不是串行的）
      expect(maxConcurrent).toBeGreaterThan(1);
    });
  });
});
