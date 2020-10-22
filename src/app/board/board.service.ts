import {Injectable} from '@angular/core';
import {Board} from '../board/board';
import { map } from 'rxjs/operators';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable()
export class BoardService extends ApiService {
  apiUrl = '/board';
  boardsCache: Board[] = [];
  refreshcard  = new BehaviorSubject(<string>(''));
  isLoading = new BehaviorSubject(false);

  getCards() {
    return this.getService('list').pipe(
      map((res) => {
      return res;
     } ));
  }

}
