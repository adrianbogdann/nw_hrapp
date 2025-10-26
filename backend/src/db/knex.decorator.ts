import { Inject } from '@nestjs/common';
import { KNEX_CONNECTION } from './knex.provider';

export const InjectConnection = () => Inject(KNEX_CONNECTION);
