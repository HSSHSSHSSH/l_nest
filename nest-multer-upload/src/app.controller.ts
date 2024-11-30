import {
  Body,
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { Request } from 'express';
import { diskStorage } from 'multer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'text/html')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('aaa')
  @UseInterceptors(
    FileInterceptor('aaa', {
      dest: 'uploads',
      storage: diskStorage({
        destination: 'uploads',
        filename: (req, file, callback) => {
          const timestamp = Date.now();
          const ext = path.extname(file.originalname);
          callback(null, `${timestamp}${ext}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body) {
    console.log('body', body);
    console.log('file', file);
    return file;
  }

  @Post('bbb')
  @UseInterceptors(
    FilesInterceptor('bbb', 3, {
      dest: 'uploads',
    }),
  )
  uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body,
  ) {
    console.log('body', body);
    console.log('files', files);
  }
  @Get('uploads/:filename')
  async downloadFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const file = path.join(__dirname, '../uploads', filename);

      // 检查文件是否存在
      if (!fs.existsSync(file)) {
        throw new NotFoundException('文件不存在');
      }

      // 设置响应头
      res.headers.set('Content-Type', 'application/octet-stream');
      res.headers.set('Content-Disposition', 'attachment');

      // 创建文件读取流并通过管道发送
      const fileStream = fs.createReadStream(file);
      return new StreamableFile(fileStream);
    } catch (error) {
      throw new NotFoundException('文件下载失败');
    }
  }
  @Post('manual-upload')
  async manualUpload(@Req() req: Request) {
    try {
      const uploadDir = 'uploads';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const chunks: Buffer[] = [];
      const fileData = await new Promise<Buffer>((resolve, reject) => {
        req.on('data', (chunk) => {
          chunks.push(chunk);
        });
        req.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
        req.on('error', (err) => {
          reject(err);
        });
      });

      const boundary = req.headers['content-type']?.split('boundary=')[1];
      if (!boundary) {
        throw new Error('No boundary found in content-type');
      }

      // 将 Buffer 转换为字符串仅用于查找头部信息
      const fileDataStr = fileData.toString();
      const parts = fileDataStr.split(`--${boundary}`);

      for (const part of parts) {
        if (part.includes('filename')) {
          const filenameMatch = part.match(/filename="(.+)"/);
          const filename = filenameMatch ? filenameMatch[1] : '';

          const uniqueFilename = `${crypto
            .randomBytes(16)
            .toString('hex')}${path.extname(filename)}`;

          // 找到文件内容的起始和结束位置
          const headerEndPosition = part.indexOf('\r\n\r\n');
          const headerStr = part.substring(0, headerEndPosition);

          // 计算实际文件内容的起始位置（在原始 buffer 中）
          const startPosition = fileData.indexOf(Buffer.from('\r\n\r\n')) + 4;
          const endPosition =
            fileData.indexOf(
              Buffer.from(`--${boundary}`, 'utf8'),
              startPosition,
            ) - 2;

          // 提取真实的文件内容（保持为 Buffer）
          const fileContent = fileData.slice(startPosition, endPosition);

          const filePath = path.join(uploadDir, uniqueFilename);
          fs.writeFileSync(filePath, fileContent);

          return {
            originalname: filename,
            filename: uniqueFilename,
            path: filePath,
          };
        }
      }

      throw new Error('No file found in request');
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }
}
