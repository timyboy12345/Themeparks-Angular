import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() padding: any = "p-4";
  @Input() cardTitle: string = "";
  @Input() cardClasses: string = "";
  @Input() titleMargin: string = "mt-4 mb-1";

  constructor() { }

  ngOnInit(): void {
  }

}
