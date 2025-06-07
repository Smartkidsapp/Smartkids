import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OptionService } from './option.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateOptionDto } from './dtos/create-option.dto';
import { SuccessResponse, SuccessResponseEnum } from 'src/core/httpResponse/SuccessReponse';
import { PublicAccess } from '../auth/decorators/public-access.decorator';

@ApiTags('Option')
@Controller('/api/v1/option')
export class OptionController {
    constructor(
        private readonly optionService: OptionService,
    ) { }

    @ApiBearerAuth()
    @Post('/')
    async createOption(@Body() createOptionDto: CreateOptionDto) {
        const category = await this.optionService.create(createOptionDto);
        return new SuccessResponse(SuccessResponseEnum.OK, undefined, category);
    }

    @PublicAccess()
    @Get('/')
    async getOptions(@Query() params) {
        const categories = await this.optionService.findBy(params);
        return new SuccessResponse(SuccessResponseEnum.OK, undefined, categories);
    }
}
