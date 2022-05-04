import { Injectable } from '@nestjs/common';
import { CommentsCreateDto } from '../dtos/comments.create.dto';

@Injectable()
export class CommentsService {
  async getAllComments() {
    return 'hello world to';
  }

  async createComment(id: string, comments: CommentsCreateDto) {
    return 'hello world';
  }

  async plusLike(id: string) {
    return 'hello Like';
  }
}
