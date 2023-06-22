import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MeteoService } from 'src/app/services/meteo.service';
import { CityListService } from 'src/app/services/city-list.service';

@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.component.html',
  styleUrls: ['./meteo.component.css'],
})
export class MeteoComponent implements OnInit {
  errorMessage: string | null = null; // ERROR MESSAGE FOR INPUT UNFOUND

  meteoData: any; // DATA FOR METEO
  dayIndex: number = 0; // INDEX FOR CALC DAYS
  activeIndex: number = 0; // ACTIVE CLASS INDEX
  currentDay: any; // CURRENT DAY
  nextDays: string[] = []; // 3 FOLLOWING DAYS OF CURRENT DAY

  // BOOLEANS TO HIDE AND SHOW
  loading: boolean = false;
  edit: boolean = false;
  input: boolean = false;
  cityNameError: boolean = false;
  //

  city: any; // INPUT VALUE
  cityNames: string[] = []; // NAMES OF AVAILABLE CITIES FROM JSON

  // FORM GROUP INITIALIZATION
  form = new FormGroup({
    title: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(2),
    ]),
  });
  //

  constructor(
    private meteoService: MeteoService,
    private cityListService: CityListService
  ) {}

  // CLASS INITIALIZATION
  ngOnInit(): void {
    this.loading = true;
    this.edit = true;

    this.calcDays();
    this.getData();
    this.getCities();
  }
  //

  // GETTING AND SORTING CITY NAMES FROM JSON
  getCities(): void {
    this.cityListService.getAllCities().subscribe((cityNames: string[]) => {
      this.cityNames = cityNames.map((city: any) => city.name.toLowerCase());
    });
  }
  //

  // GETTING WHOLE THE METEO DATA
  getData(): void {
    this.meteoService.getMeteo().subscribe((meteoData) => {
      this.meteoData = meteoData;

      let sunsetTime = new Date(this.meteoData.city.sunset * 1000); // CONVERTING SUNSET TIME TO AN HOUR OF TIME
      this.meteoData.sunsetTime = sunsetTime.toLocaleTimeString(); // INJECTING THE VALUE OF sunsetTime TO OUR JSON

      let currentDate = new Date(); // INJECTING A DATE JS OBJECT
      this.meteoData.isDay = currentDate.getTime() < sunsetTime.getTime(); // ESTABLISH isDay OBJECT PARAMETER FOR DAY (OR NIGHT)

      this.loading = false;
      this.edit = false;
      this.input = false;
    });
  }
  //

  // CALCULATE CURRENT DAY & NEXT DAYS
  calcDays(): void {
    const date = new Date();
    const days = [
      'Dimanche',
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
    ];
    this.currentDay = days[date.getDay()];

    for (let i = 1; i <= 3; i++) {
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + i);
      this.nextDays.push(days[nextDate.getDay()]);
    }
  }
  //

  // SWITH DAYS IN TEMPLATE
  nextDay(index: number, event: MouseEvent): void {
    event.preventDefault();
    this.dayIndex = index;
    this.activeIndex = index;
  }
  //

  // SHOWING INPUT
  showInput(): void {
    this.edit = true;
    this.input = true;
  }
  //

  // HIDING INPUT
  closeInput(): void {
    this.edit = false;
    this.input = false;
    this.cityNameError = false;
  }
  //

  // SUBMITTING FORM
  submit() {
    this.city = this.form.get('title')?.value;

    // COMPARE THE SUBMITTED CITY WITH THE CITY NAMES ARRAY
    const cityExists = this.cityNames.includes(this.city.toLowerCase());

    if (!cityExists) {
      this.cityNameError = true;
      this.errorMessage = 'Nous ne connaissons pas cette ville';
      console.error(this.errorMessage);
      return;
    }

    // SENDING INPUT VALUE TO METEO SERVICE
    this.meteoService.setCity(this.city);
    this.getData();
  }
  //
}
