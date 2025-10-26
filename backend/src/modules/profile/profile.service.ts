import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from '../../db/knex.decorator';

@Injectable()
export class ProfileService {
  constructor(@InjectConnection() private readonly db: Knex) {}

  async findByUserId(userId: number) {
    return this.db('profiles').where({ user_id: userId }).first();
  }

  async findAll() {
    return this.db('profiles');
  }

  async updateProfile(userId: number, data: Record<string, any>) {
    await this.db('profiles').where({ user_id: userId }).update(data);
    return this.findByUserId(userId);
  }
}
