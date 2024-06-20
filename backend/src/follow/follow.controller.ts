import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Get,
  UsePipes,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowDto } from './dto/follow.dto';
import { User } from '../users/utils/decorators/user.decorator';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Follow } from './entities/follow.entity';
import { FollowResponse } from './dto/responses/follow.response';
import { ParseMongoIdPipe } from '../utils/pipes/parse-mongo-id.pipe';

@ApiTags('Follow')
@ApiBearerAuth()
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  @ApiCreatedResponse({
    type: FollowResponse,
  })
  create(
    @User('id') followerId: string,
    @Body() createFollowDto: FollowDto,
  ): Promise<Follow> {
    createFollowDto.followerId = followerId;
    return this.followService.create(createFollowDto);
  }

  @Get('requests')
  @ApiOkResponse({
    type: FollowResponse,
    isArray: true,
  })
  findAll(@User('id') id: string): Promise<Follow[]> {
    return this.followService.findFollowRequests(id);
  }
  @Post(':id')
  @ApiOkResponse({
    type: FollowResponse,
  })
  @UsePipes(ParseMongoIdPipe)
  accept(@Param('id') id: string): Promise<Follow> {
    return this.followService.update(id);
  }

  @Delete(':id')
  @ApiNoContentResponse()
  @UsePipes(ParseMongoIdPipe)
  async remove(@Param('id') id: string): Promise<void> {
    await this.followService.remove(id);
  }
}
