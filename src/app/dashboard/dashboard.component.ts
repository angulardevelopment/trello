import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BoardService} from '../board/board.service';
import {Board} from '../board/board';

@Component({
  selector: 'app-gtm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  boards: Board[] = [{title: 'generic board', _id: '1', columns: [], cards: [], userList: []}];

  constructor(private _bs: BoardService,
      private _router: Router) { }

  ngOnInit() {
    setTimeout(function() {
      document.getElementById('content-wrapper').style.backgroundColor = '#fff';
    }, 100);
  }

  public addBoard() {
    alert(`Only 1 Board allowed in basic version To add more boards you need to subscribe
    premium version`);
  }

}
