import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phoneNumber: string;

  @Column({ type: 'enum', enum: ['Admin', 'User'], default: 'User' })
  role: 'Admin' | 'User';

  @Column({ type: 'enum', enum: ['Active', 'Inactive'], default: 'Active' })
  status: 'Active' | 'Inactive';

  @Column({ type: 'json' })
  address: {
    street: string;
    number: string;
    city: string;
    postalCode: string;
  };

  @Column({ nullable: true })
  profilePicture: string;

  @Column()
  password: string;
}
