import { Injectable, InternalServerErrorException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from '../../db/knex.decorator';
import fetch from 'node-fetch';
import { HF } from '../../constants/hf';


@Injectable()
export class FeedbackService {
  constructor(@InjectConnection() private readonly db: Knex) {}

  async polishText(text: string): Promise<string> {
    if (!HF.TOKEN) return text; // no key -> skip polishing
    try {
      const response = await fetch(`${HF.API_URL}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HF.TOKEN}`,
          'Content-Type': 'application/json',
        },
         body: JSON.stringify({
          model: `${HF.MODEL_ID}`,
          messages: [
            {
              role: "user",
              content: `Rewrite the following text to sound more polished and professional: ${text}. Return back only the polished response and nothing else`,
            }
          ]
        })
      });

      const data = await response.json();

      // Handle typical HF responses for paraphrasing models
      if (Array.isArray(data.choices) && data.choices[0]?.message.content) {
        return data.choices[0].message.content.trim();
      }

      console.log('Unexpected HF response, returning original text');
      return text;

    } catch (e) {
      console.error('[HF-ERROR]', e);
      throw new InternalServerErrorException('AI polishing failed');
    }
  }

  async createFeedback(fromId: number, toId: number, content: string, polish = false) {
    let finalText = content;
    let polishedText = 'false'

    if (polish && HF.TOKEN) {
      polishedText = await this.polishText(content)
    }

    const inserted = await this.db('feedbacks').insert({
      from_user_id: fromId,
      to_user_id: toId,
      content: finalText,
      polished: polishedText,
    }).returning('id');

    // handle postgres / sql
    const newId = Array.isArray(inserted)
  ? inserted[0]?.id ?? inserted[0]
  : inserted;

    return this.db('feedbacks').where({ id: newId }).first();
  }

  async getFeedbackForUser(toId: number) {
    return this.db('feedbacks')
    .leftJoin('users as from', 'feedbacks.from_user_id', 'from.id')
    .leftJoin('users as to', 'feedbacks.to_user_id', 'to.id')
    .select(
      'feedbacks.id',
      'feedbacks.content',
      'feedbacks.polished',
      'feedbacks.created_at',
      this.db.raw(`json_build_object('id', "from"."id", 'email', "from"."email", 'role', "from"."role") as from_user`),
      this.db.raw(`json_build_object('id', "to"."id", 'email', "to"."email", 'role', "to"."role") as to_user`)
    )
    .where('feedbacks.to_user_id', toId)
    .orderBy('feedbacks.created_at', 'desc');
  }

  async findGivenByUser(userId: number) {
    return this.db('feedbacks').where('from_user_id', userId).orderBy('created_at', 'desc');
  }

  async updateFeedback(id: number, userId: number, role: string, dto: { content?: string; repolish?: boolean; }) {
    const existing = await this.db('feedbacks').where({ id }).first();
    if (!existing) throw new NotFoundException('Feedback not found');

    // Only owner can edit
    if (existing.from_user_id !== userId) {
      throw new ForbiddenException('You can only edit your own feedback');
    }

    let polished = existing.polished;
    let content = existing.content;

    if (typeof dto.content === 'string') {
      content = dto.content;
      if (dto.repolish) {
        polished = await this.polishText(content);
      }
    }

    await this.db('feedbacks').where({ id }).update({ content, polished });
    return this.db('feedbacks').where({ id }).first();
  }

  async deleteFeedback(id: number, userId: number, role: string) {
    const existing = await this.db('feedbacks').where({ id }).first();
    if (!existing) throw new NotFoundException('Feedback not found');

    // Creator OR manager can delete
    const isOwner = existing.from_user_id === userId;
    const isManager = role === 'manager';
    if (!isOwner && !isManager) {
      throw new ForbiddenException('You cannot delete this feedback');
    }

    await this.db('feedbacks').where({ id }).del();
    return { ok: true };
  }
}
