import {  Controller, Get, Post, Put, Delete, Param, Body, UseGuards, NotFoundException, Query, Request, ForbiddenException, ParseIntPipe, BadRequestException, UseInterceptors, UploadedFile} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleValidationPipe } from './pipes/role-validation.pipe';
import { StatusValidationPipe } from './pipes/status-validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from '../files/files.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly filesService: FilesService,) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('role', RoleValidationPipe) role?: 'Admin' | 'User',
    @Query('status', StatusValidationPipe) status?: 'Active' | 'Inactive',
    @Query('search') search?: string,
  ): Promise<{ data: User[]; totalItems: number; message?: string }> {
    const result = await this.usersService.findAll(page, limit, role, status, search);

    if (result.totalItems === 0) {
      return { ...result, message: 'No users found with the specified criteria.' };
    }

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<User> {
    const user = req.user;

    if (user.role !== 'Admin' && user.id !== id) {
      throw new ForbiddenException('You can only access your own data');
    }

    const foundUser = await this.usersService.findOne(id);
    if (!foundUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return foundUser;
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  @UseInterceptors(FileInterceptor('profilePicture')) 
  async create(@Body() userData: CreateUserDto, @UploadedFile() file: Express.Multer.File): Promise<User> {

    if (userData.profilePicture) {
      const imageUrl = await this.filesService.saveBase64Image(userData.profilePicture);
      userData.profilePicture = imageUrl;
    }

    return this.usersService.create(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Request() req, @Body() userData: UpdateUserDto): Promise<User> {

    const user = req.user;

    if (user.role !== 'Admin' && user.id !== id) {
      throw new ForbiddenException('You can only access your own data');
    }

    console.log(userData);

    if (Object.keys(userData).length === 0) {
      throw new BadRequestException('At least one field must be provided to update.');
    }

    if (userData.profilePicture) {
      const imageUrl = await this.filesService.saveBase64Image(userData.profilePicture);
      userData.profilePicture = imageUrl;
    }

    return this.usersService.update(id, userData);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<{ message: string }> {

    const foundUser = await this.usersService.findOne(id);
    if (!foundUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.usersService.remove(id);
    return { message: `User with ID ${id} has been successfully deleted.` };
  }
}
