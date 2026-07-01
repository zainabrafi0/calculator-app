import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { CalculationsService } from './calculations.service';
import { CreateCalculationDto } from './dto/create-calculation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Ensure this path matches your setup!

@UseGuards(JwtAuthGuard)
@Controller('api/calculations')
export class CalculationsController {
  constructor(private readonly calcService: CalculationsService) {}

  @Post()
  create(@Body() createCalculationDto: CreateCalculationDto, @Req() req: any) {
    // The Controller now correctly calls the new .create() method
    return this.calcService.create(createCalculationDto, req.user.id);
  }

  @Get()
  findAll(
    @Req() req: any,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
    @Query('sort') sort: string,
  ) {
    // We safely parse the string queries from React into numbers for the Service
    return this.calcService.findAll(
      req.user.id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 5,
      search,
      sort
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.calcService.remove(id, req.user.id);
  }

  @Delete()
  removeAll(@Req() req: any) {
    return this.calcService.removeAll(req.user.id);
  }
}