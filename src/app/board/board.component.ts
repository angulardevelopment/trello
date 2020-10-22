import { Component, Input, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { Board } from '../board/board';
import { Column } from '../column/column';
import { Card } from '../card/card';
import { BoardService } from './board.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { CardService } from '../card/card.service';


@Component({
  selector: 'app-gtm-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {
  board: Board;
  addingColumn = false;
  addColumnText: string;
  editingTilte = false;
  currentTitle: string;
  boardWidth: number;
  columnsAdded = 0;
  searchText = '';
  selectedData = '0';
  options = [
    { name: 'Task Priority', value: '0', checked: true },
    { name: 'high', value: '1', checked: true },
    { name: 'medium', value: '2', checked: false },
    { name: 'low', value: '3', checked: true }
  ];

  constructor(public el: ElementRef, private _board?: BoardService, private _cards?: CardService) {
  }

  ngOnInit() {
    this._board.refreshcard.subscribe((res) => {
      if (res === 'deleteCard') {
        this.getData();
      } else {
        this.getData();
      }
    });


  }

  getData() {
    this._board.getCards().subscribe((res) => {
      this.board = { title: 'Mini-Task Manager', _id: '1', columns: [], cards: [], userList: [] };

      this.board.columns = [{
        boardId: '5f8ed7a917c0456f389586a7',
        order: 1000, title: 'Add tasks', _id: '1'
      }];
      if (this.searchText) {
        this.board.cards = this.updateHtmlSearch(this.searchText, res['tasks'], 'message');
      } else if (this.selectedData !== '0') {
        this.board.cards = this.updateHtmlSearch(this.selectedData, res['tasks'], 'priority');
      } else {
        this.board.cards = res['tasks'];
      }
      this._cards.getAllUsers().subscribe((resp) => {
        this.board.userList = resp['users'];
      });
      document.title = this.board.title + ' | Generic Task Manager';
      this.setupView();
    });
  }

  setupView() {
    setTimeout(() => {
      const component = this;
      window.addEventListener('resize', function (e) {
        component.updateBoardWidth();
      });
      component.updateBoardWidth();
      document.getElementById('content-wrapper').style.backgroundColor = '';
    }, 100);
  }

  updateHtmlSearch(searchText: string, tasks, key) {
    const tempData = tasks;
    tasks = tempData.filter(person =>
      (person[key].toLowerCase().indexOf(searchText.toLowerCase()) > -1) === true ? person[key] : '');
    return tasks;
  }

  updateBoardWidth() {
    // this.boardWidth = ((this.board.columns.length + (this.columnsAdded > 0 ? 1 : 2)) * 280) + 10;
    this.boardWidth = ((this.board.columns.length + 1) * 280) + 10;
if (document.getElementById('main')) {

    if (this.boardWidth > document.body.scrollWidth) {
      document.getElementById('main').style.width = this.boardWidth + 'px';
    } else {
      document.getElementById('main').style.width = '100%';
    }

  }
    if (this.columnsAdded > 0) {
      const wrapper = document.getElementById('content-wrapper');
      wrapper.scrollLeft = wrapper.scrollWidth;
    }

    this.columnsAdded++;
  }

  updateBoard() {
    if (this.board.title && this.board.title.trim() !== '') {
      // this._boardService.put(this.board);
    } else {
      this.board.title = this.currentTitle;
    }
    this.editingTilte = false;
    document.title = this.board.title + ' | Generic Task Manager';
  }

  editTitle() {
    this.currentTitle = this.board.title;
    this.editingTilte = true;

    const input = this.el.nativeElement
      .getElementsByClassName('board-title')[0]
      .getElementsByTagName('input')[0];

    setTimeout(function () { input.focus(); }, 0);
  }

  blurOnEnter(event) {
    if (event.keyCode === 13) {
      event.target.blur();
    }
  }

  enableAddColumn() {
    this.addingColumn = true;
    const input = document.querySelectorAll('.add-column')[0]
      .getElementsByTagName('input')[0];

    setTimeout(function () { input.focus(); }, 0);
    alert(`Only 1 Column allowed in basic version To add more columns subscribe to
    premium version`);
  }

  addColumn() {
    const newColumn = <Column>{
      title: this.addColumnText,
      order: (this.board.columns.length + 1) * 1000,
      boardId: this.board._id
    };

    this.board.columns.push(newColumn);
    this.updateBoardWidth();
    this.addColumnText = '';

  }

  addColumnOnEnter(event) {
    if (event.keyCode === 13) {
      if (this.addColumnText && this.addColumnText.trim() !== '') {
        this.addColumn();
      } else {
        this.clearAddColumn();
      }
    } else if (event.keyCode === 27) {
      this.clearAddColumn();
    }
  }

  addColumnOnBlur() {
    if (this.addColumnText && this.addColumnText.trim() !== '') {
      this.addColumn();
    }
    this.clearAddColumn();
  }

  clearAddColumn() {
    this.addingColumn = false;
    this.addColumnText = '';
  }


  addCard(card: Card) {

    this.board.cards.push(card);

  }

  foreceUpdateCards() {
    const cards = JSON.stringify(this.board.cards);
    this.board.cards = JSON.parse(cards);
  }


  onCardUpdate(card: Card) {
    this.foreceUpdateCards();
  }

  ngOnDestroy() {
  }
}
