import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { generateParseIntPipe } from 'src/utils';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';

@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  // 会议室查询
  @Get('list')
  async list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(2),
      generateParseIntPipe('pageSize'),
    )
    pageSize: number,
  ) {
    return await this.meetingRoomService.find(pageNo, pageSize);
  }

  // 通过 id 精确查询会议室
  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.meetingRoomService.findById(id);
  }

  // 会议室创建
  @Post('create')
  async create(@Body() meetingRoomDto: CreateMeetingRoomDto) {
    await this.meetingRoomService.create(meetingRoomDto);
  }
  // 会议室更新
  @Put('update')
  async update(@Body() meetingRoomDto: UpdateMeetingRoomDto) {
    await this.meetingRoomService.update(meetingRoomDto);
  }
  // 通过 id 删除会议室
  @Delete(':id')
  async deleteById(@Param('id') id: number) {
    return await this.meetingRoomService.deleteById(id);
  }
}
