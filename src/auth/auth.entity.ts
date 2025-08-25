import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column({
    default: false,
  })
  isRestricted: boolean;

  // Optional: store when user was created/updated
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ nullable: true })
  currentHashedRefreshToken?: string;

  // Hash password before saving
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      // const salt = await bcrypt.genSalt(10);
      // Only hash if password is plain text (not already hashed)
      if (this.password && !this.password.startsWith('$2b$')) {
        this.password = await bcrypt.hash(this.password, 10);
      }
    }
  }

  // Compare password helper
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  async setCurrentRefreshToken(refreshToken: string) {
    // const salt = await bcrypt.genSalt(10);
    this.currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  }

  async validateRefreshToken(refreshToken: string): Promise<boolean> {
    if (!this.currentHashedRefreshToken) return false;
    return bcrypt.compare(refreshToken, this.currentHashedRefreshToken);
  }
}
