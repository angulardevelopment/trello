import {Component, Input, Output, OnInit, AfterViewInit, EventEmitter, ElementRef} from '@angular/core';
import {Column} from './column';
import {Card} from '../card/card';
import {CardService} from '../card/card.service';
import { BoardService } from '../board/board.service';

// declare var jQuery: any;

@Component({
  selector: 'app-gtm-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css'],
})
export class ColumnComponent implements OnInit {
  @Input() column: Column;
  @Input() cards: Card[];
  @Input() userList;

  @Output() addNewCard: EventEmitter<Card>;
  @Output() cardUpdate: EventEmitter<Card>;

  editingColumn = false;
  addingCard = false;
  addCardText: string;
  currentTitle: string;


  constructor(private el: ElementRef, private _cards?: CardService,  private _board?: BoardService) {
    this.addNewCard = new EventEmitter();
    this.cardUpdate = new EventEmitter();
  }

  ngOnInit() {

  }

  addColumnOnEnter(event) {
    if (event.keyCode === 13) {
      this.updateColumn();
    } else if (event.keyCode === 27) {
      this.cleadAddColumn();
    }
  }

  addCard() {
    this.cards = this.cards || [];
    const newCard = <Card>{
      message: this.addCardText,
      order: (this.cards.length + 1) * 1000,
      columnId: this.column._id,
      boardId: this.column.boardId,
      priority: '0',
      due_date: new Date().toISOString().
      replace(/T/, ' ').
      replace(/\..+/, ''),
      assigned_to: '1'
    };

      const formData: FormData = new FormData();
      formData.append('message', newCard.message);
      formData.append('due_date', newCard.due_date);
      formData.append('priority', newCard.priority);
      formData.append('assigned_to', newCard.assigned_to);
      this._cards.postCard(formData).subscribe((res) => {
        if (res['status'] === 'success') {
          newCard['id'] = res['taskid'];
          this.addNewCard.emit(newCard);
          alert('Task Added Successfully');
        }
     });


  }

  addCardOnEnter(event) {
    if (event.keyCode === 13) {
      if (this.addCardText && this.addCardText.trim() !== '') {
        this.addCard();
        this.addCardText = '';
      } else {
        this.clearAddCard();
      }
    } else if (event.keyCode === 27) {
      this.clearAddCard();
    }
  }

  updateColumn() {
    if (this.column.title && this.column.title.trim() !== '') {
      this.editingColumn = false;
    } else {
      this.cleadAddColumn();
    }
  }

  cleadAddColumn() {
    this.column.title = this.currentTitle;
    this.editingColumn = false;
  }

  editColumn() {
    this.currentTitle = this.column.title;
    this.editingColumn = true;
    const input = this.el.nativeElement
      .getElementsByClassName('column-header')[0]
      .getElementsByTagName('input')[0];

    setTimeout(function() { input.focus(); }, 0);
  }

  enableAddCard() {
    this.addingCard = true;
    const input = this.el.nativeElement
      .getElementsByClassName('add-card')[0]
      .getElementsByTagName('input')[0];

    setTimeout(function() { input.focus(); }, 0);
  }


  updateColumnOnBlur() {
    if (this.editingColumn) {
      this.updateColumn();
      this.clearAddCard();
    }
  }


  addCardOnBlur() {
    if (this.addingCard) {
      if (this.addCardText && this.addCardText.trim() !== '') {
        this.addCard();
      }
    }
    this.clearAddCard();
  }

  clearAddCard() {
    this.addingCard = false;
    this.addCardText = '';
  }

  onCardUpdate(card: Card) {
    this.cardUpdate.emit(card);
  }
}
