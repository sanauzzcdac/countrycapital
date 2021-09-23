import { Component } from '@angular/core';
import { AppserviceService } from './appservices/appservice.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent{
  title = 'TransportSimple';
  countries: any[];
  indexvar: any;
  indexheader: any;
  contextMenuPosition = { x: '0px', y: '0px' };
  showRightClickOptions: boolean;
  capital: string;
  tableform: FormGroup;

  constructor( private appService: AppserviceService, private fb: FormBuilder) { }
 
  ngOnInit() {

    this.appService.getCountries().then(countries => {
      this.countries = countries;
    });
   
    let localarray = JSON.parse(localStorage.getItem('appDemo'));

    if (localarray === null || localarray.length === 0) {
      this.tableform = this.fb.group({
        left:false,
        right:false,
        country_capital: this.fb.array([this.fb.group({ country: '', capital: '', colleft: '', colright: '' })
        ])
      })
    } else {
      let tablearray=localarray.country_capital;
      let arr = [];
      for (let i = 0; i < tablearray.length; i++) {
        arr.push(this.fb.group({ country: tablearray[i].country, capital: tablearray[i].capital, colleft: tablearray[i].colleft, colright: tablearray[i].colright }));
      }
      this.tableform = this.fb.group({
        left:localarray.left,
        right:localarray.right,
        country_capital: this.fb.array(arr)
      })
    }
  }

  get tableformFields() {
    return this.tableform.get('country_capital') as FormArray;
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.showRightClickOptions = true;
  }

  addRowAbove() {
    this.tableformFields.insert(this.indexvar, this.fb.group({ country: '', capital: '', colleft: '', colright: '' }));
    this.showRightClickOptions = false;
  }

  addRowBelow() {
    this.tableformFields.insert(this.indexvar + 1, this.fb.group({ country: '', capital: '', colleft: '', colright: '' }));
    this.showRightClickOptions = false;
  }

  removeRow() {
    const control = this.tableform.get('country_capital') as FormArray;
    control.removeAt(this.indexvar);
    this.showRightClickOptions = false;
  }

  addColumnLeft() {
    this.tableform.patchValue({left:true});
    this.showRightClickOptions = false;
  }

  addColumnRight() {
    this.tableform.patchValue({right:true});
    this.showRightClickOptions = false;
  }

  getCapitalName(event, index) {
    for (let i = 0; i < this.countries.length; i++) {
      if (this.countries[i].name == event.target.value) {
        this.capital = this.countries[i].capital;
        ((this.tableform.get('country_capital') as FormArray).at(index) as FormGroup).get('capital').patchValue(this.capital);
      }
    }
  }

  getCountryName(event, index) {
    for (let i = 0; i < this.countries.length; i++) {
      if (this.countries[i].capital == event.target.value) {
        let country = this.countries[i].name;
        ((this.tableform.get('country_capital') as FormArray).at(index) as FormGroup).get('country').patchValue(country);
      }
    }
  }

  updateAllDetails() {
    const data = JSON.stringify(this.tableform.value);
    localStorage.setItem('appDemo', data);
    alert('Details Saved successfully');
  }
}
