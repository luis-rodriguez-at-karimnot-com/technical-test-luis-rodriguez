import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import * as bcrypt from 'bcryptjs'
import { UsersService } from '../users/users.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  // Crear usuario admin
  const adminPassword = await bcrypt.hash('password', 10);
  await usersService.create({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    phoneNumber: '1234567890',
    role: 'Admin',
    status: 'Active',
    address: {
      street: 'Main St',
      number: '100',
      city: 'Somewhere',
      postalCode: '12345',
    },
    profilePicture: '',
    password: adminPassword,
  });

  // Crear 50 usuarios aleatorios
  for (let i = 1; i <= 50; i++) {
    const password = await bcrypt.hash('password', 10);
    await usersService.create({
      firstName: `User${i}`,
      lastName: 'Test',
      email: `user${i}@example.com`,
      phoneNumber: `12345678${i}`,
      role: 'User',
      status: 'Active',
      address: {
        street: `Street ${i}`,
        number: `${i}`,
        city: 'City',
        postalCode: '12345',
      },
      profilePicture: '',
      password: password,
    });
  }

  console.log('Seed completed!');
  await app.close();
}

seed();
