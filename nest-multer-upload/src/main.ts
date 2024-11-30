import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.use('/uploads', async (req, res, next) => {
    try {
      console.log('拦截静态资源请求', req.path);
      console.log('拦截静态资源请求', req.path);
      if (!req.path) {
        return res.status(400).json({
          message: '无效的请求路径',
          code: 400,
        });
      }

      const filename = req.path.replace(/^\/+/, '');
      console.log(req.query);
      // 处理下载请求
      if (1) {
        const filepath = path.join(__dirname, '../uploads', filename);

        // 检查文件是否存在
        if (!fs.existsSync(filepath)) {
          return res.status(404).json({
            message: '文件不存在',
            code: 404,
          });
        }

        // 获取文件信息
        const stat = fs.statSync(filepath);
        if (!stat.isFile()) {
          return res.status(400).json({
            message: '请求的资源不是文件',
            code: 400,
          });
        }

        // 获取文件MIME类型
        const mimeType = getMimeType(filename);

        // 使用时间戳作为新文件名
        const timestamp = Date.now();
        const ext = path.extname(filename);
        const newFilename = `${timestamp}${ext}`;

        // 设置响应头
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Length', stat.size);
        res.setHeader(
          'Content-Disposition',
          `attachment; filename*=UTF-8''${encodeURIComponent(newFilename)}`,
        );
        console.log('设置响应头', res.getHeaders());

        // 创建文件流并返回
        return fs.createReadStream(filepath).pipe(res);
      }

      next();
    } catch (error) {
      console.error('处理文件下载请求时发生错误:', error);
      res.status(500).json({
        message: '服务器内部错误',
        code: 500,
      });
    }
  });

  // 辅助函数：获取MIME类型
  function getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf',
      '.mp4': 'video/mp4',
      '.zip': 'application/zip',
      // 可以根据需要添加更多类型
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  // 添加中间件处理静态资源请求

  await app.listen(3000);
}
bootstrap();
