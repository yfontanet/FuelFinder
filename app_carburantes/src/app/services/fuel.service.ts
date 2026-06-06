import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FuelService {

  private http = inject(HttpClient);

  private terrestrialUrl =
    'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/';

  private maritimeUrl =
    'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/PostesMaritimos/';

  getTerrestrialStations() {
    return this.http.get<any>(this.terrestrialUrl);
  }

  getMaritimeStations() {
    return this.http.get<any>(this.maritimeUrl);
  }

}