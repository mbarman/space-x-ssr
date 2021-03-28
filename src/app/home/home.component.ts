import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  launchYears = [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020];
  cards = [];
  baseAPI = 'https://api.spaceXdata.com/v3/launches?limit=100';
  selectedYear = '';
  selectedLaunch = '';
  selectedLanding = '';

  constructor(private http: HttpClient,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              @Inject(PLATFORM_ID) private _platformId: Object
    ) {

  }

  initiateSubscription(){
    this.activatedRoute.params.subscribe((params) =>{
      this.preselectButton(params);


      if (isPlatformBrowser(this._platformId)) {
        console.log('rendered in browser');
        if(params.hasOwnProperty('launch_year') || params.hasOwnProperty('launch_success') || params.hasOwnProperty('land_success')){
          this.getFilteredData(params);
        } else {
          this.getData(this.baseAPI);
        }
     }
     if (isPlatformServer(this._platformId)) {
       console.log('rendered in server');
       this.getData(this.baseAPI);
     }



    })
  }

  preselectButton(params){
    if(params['launch_year']){
      this.selectedYear = params['launch_year']
    }
    if(params['launch_success']){
      this.selectedLaunch = params['launch_success']
    }
    if(params['land_success']){
      this.selectedLanding = params['land_success']
    }
  }

  ngOnInit(): void {
    this.initiateSubscription();
  }

  getFilteredData(params){
    let filter = Object.entries(params);
    let filteredApi = this.baseAPI ;
    for(let item of filter){
      filteredApi = filteredApi + '&' + item[0] + '=' + item[1].toString().toLowerCase();
    }
    this.getData(filteredApi);
  }

  getData(api){
    this.http.get<[]>(api).subscribe((result) => {
      this.cards = result;
    })
  }

  filterYear(evt) {
    if(this.selectedYear.toString() !== evt.target.childNodes[0].data){
      this.selectedYear = evt.target.childNodes[0].data;
    } else{
      this.selectedYear = '';
    }
    this.updateURL();
  }

  launch(evt) {
    if(this.selectedLaunch.toString() !== evt.target.childNodes[0].data){
      this.selectedLaunch = evt.target.childNodes[0].data;
    } else{
      this.selectedLaunch = '';
    }
    this.updateURL();
  }

  landing(evt) {
    if(this.selectedLanding.toString() !== evt.target.childNodes[0].data){
      this.selectedLanding = evt.target.childNodes[0].data;
    } else{
      this.selectedLanding = '';
    }
    this.updateURL();
  }

  updateURL() {
    let parameters = {};
    if(this.selectedYear != ''){
      parameters['launch_year'] = this.selectedYear;
    }
    if(this.selectedLaunch != ''){
      parameters['launch_success'] = this.selectedLaunch;
    }
    if(this.selectedLanding != ''){
      parameters['land_success'] = this.selectedLanding;
    }
    this.router.navigate(['/home', parameters]);
  }

}
