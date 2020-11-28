import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() padding: any = 'p-4';
  @Input() cardTitle = '';
  @Input() cardSubTitle?: string;
  @Input() cardClasses = '';
  @Input() titleMargin = 'mt-4 mb-1';

  constructor() { }

  ngOnInit(): void {
  }

}
