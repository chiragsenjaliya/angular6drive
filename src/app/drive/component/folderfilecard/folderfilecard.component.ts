import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-folderfilecard',
  templateUrl: './folderfilecard.component.html',
  styleUrls: ['./folderfilecard.component.scss']
})
export class FolderfilecardComponent implements OnInit {
  @Input() element:any;
  constructor() { }

  ngOnInit() {
    
  }

}
