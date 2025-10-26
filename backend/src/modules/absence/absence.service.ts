import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from '../../db/knex.decorator';

@Injectable()
export class AbsenceService {
  constructor(@InjectConnection() private readonly db: Knex) {}

  async createAbsence(userId: number, data: Record<string, any>) {
    const [inserted] = await this.db('absences')
      .insert({ user_id: userId, ...data })
      .returning('*');
    return inserted;
  }

  async getForUser(userId: number) {
    return this.db('absences').where({ user_id: userId }).orderBy('created_at', 'desc');
  }

  async getAll() {
    return this.db('absences').innerJoin('users', 'users.id', 'absences.user_id').select(['absences.*', 'users.email']).orderBy('absences.created_at', 'desc');
  }

  async updateStatus(id: number, status: 'approved' | 'rejected') {
    await this.db('absences').where({ id }).update({ status });
    return this.db('absences').where({ id }).first();
  }
}
