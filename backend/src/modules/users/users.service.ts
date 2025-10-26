import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from '../../db/knex.decorator';

@Injectable()
export class UsersService {
  constructor(@InjectConnection() private readonly db: Knex) {}

//   TODO: move in model
  async findByEmail(email: string) {
    return this.db('users').where({ email }).first();
  }

  async findById(id: number) {
    return this.db('users').where({ id }).first();
  }

   async findAll() {
    // Minimal select, no sensitive info
    return this.db('users').select('id', 'email', 'role').orderBy('id', 'asc');
  }
}
