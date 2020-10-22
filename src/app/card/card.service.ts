import {Injectable} from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiService } from '../api.service';
@Injectable()
export class CardService extends ApiService {
  apiUrl = '/card';

  getAllUsers() {
    return this.getService('listusers').pipe(map(res => res));
  }

  deleteTask(taskId) {
    return this.postService('delete', taskId).pipe(
      map(res => res));
  }

  postCard(card) {
    return this.postService('create', (card)).pipe(
      map(res => res));
  }

  updateCard(card) {
    return this.postService('update', (card)).pipe(
      map(res => res));
  }
}
