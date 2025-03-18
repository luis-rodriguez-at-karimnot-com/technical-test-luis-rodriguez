import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    role?: 'Admin' | 'User',
    status?: 'Active' | 'Inactive',
    search?: string,
  ): Promise<{ data: User[]; totalItems: number }> {
    const skip = (page - 1) * limit;
    const where: any = {};
  
    if (role) where.role = role;
    if (status) where.status = status;
  
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
  
    if (search) {
      queryBuilder.where(
        '(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` },
      );
    }
  
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }
  
    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }
  
    const [data, totalItems] = await queryBuilder
    .orderBy('user.id', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();
  
    return { data, totalItems };
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, userData);
    const updatedUser = await this.findOne(id);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
