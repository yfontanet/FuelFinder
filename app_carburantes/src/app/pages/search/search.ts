import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CCAA_PROVINCIAS } from '../../data/ccaa-provincias';

import { CARBURANTES_TERRESTRES } from '../../data/carburantes-terrestres';
import { CARBURANTES_MARITIMOS } from '../../data/carburantes-maritimos';

import { inject } from '@angular/core';
import { FuelService } from '../../services/fuel.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss'
})

export class Search {
  private cdr = inject(ChangeDetectorRef);

  stationType = 'terrestre';

  comunidades = Object.keys(CCAA_PROVINCIAS);
  todasLasProvincias = [
    ...new Set(
      Object.values(CCAA_PROVINCIAS).flat()
    )
  ].sort();
  provinciasFiltradas: string[] = [];

  onStationTypeChange() {
    this.loading = false;
    // Limpiar resultados anteriores
    this.results = [];

    // Reiniciar filtros
    this.filters = {
      ...this.defaultFilters
    };

    // Reiniciar provincias disponibles
    if (this.stationType === 'maritima') {
      this.provinciasFiltradas = this.todasLasProvincias;
    } else {
      this.provinciasFiltradas = [];
    }

    // Asegurar actualización de la vista
    this.cdr.detectChanges();
  }

  get carburantes() {
    return this.stationType === 'terrestre'
      ? CARBURANTES_TERRESTRES
      : CARBURANTES_MARITIMOS;
  }

  private readonly defaultFilters = {
    comunidad: '',
    provincia: '',
    carburante: '',
    fecha: '',
    cantidad: 10,
    orden: 'asc'
  };

  filters = { ...this.defaultFilters };

  private fuelService = inject(FuelService);
  results: any[] = [];
  loading = false;

  async search() {
    this.loading = true;
    this.cdr.detectChanges();

    let userLat: number;
    let userLon: number;

    try {

      const position =
        await this.getCurrentPosition();

      userLat =
        position.coords.latitude;

      userLon =
        position.coords.longitude;

    } catch (error) {
      
      alert(
        'Es necesario permitir la geolocalización para buscar las estaciones más cercanas.' + 'Comprueba los permisos del navegador y del ordenador.'
      );

      this.loading = false;
      return;
    }

    const request =
      this.stationType === 'terrestre'
        ? this.fuelService.getTerrestrialStations()
        : this.fuelService.getMaritimeStations();

    request.subscribe(response => {
    
      let stations =
        response.ListaEESSPrecio;

      // FILTRAR PROVINCIA

      if (this.filters.provincia) {

        stations = stations.filter(
          (s: any) =>
            s.Provincia ===
            this.filters.provincia.toUpperCase()
        );

      }

      // FILTRAR CARBURANTE

      if (this.filters.carburante) {

        const fuelProperty =
          this.getFuelProperty();

        stations = stations.filter(
          (s: any) =>
            s[fuelProperty] &&
            s[fuelProperty] !== ''
        );

        // ORDENAR POR PRECIO

        stations.sort(
          (a: any, b: any) => {

            const priceA =
              this.parsePrice(
                a[fuelProperty]
              );

            const priceB =
              this.parsePrice(
                b[fuelProperty]
              );

            return this.filters.orden === 'asc'
              ? priceA - priceB
              : priceB - priceA;

          }
        );

      }

      stations = stations.map(
        (station: any) => {

          const lat =
            parseFloat(
              station['Latitud']
                .replace(',', '.')
            );

          const lon =
            parseFloat(
              station['Longitud (WGS84)']
                .replace(',', '.')
            );

          return {
            ...station,
            distance:
              this.calculateDistance(
                userLat,
                userLon,
                lat,
                lon
              )
          };
        }
      );

      stations.sort(
        (a: any, b: any) =>
          a.distance - b.distance
      );

      this.results =
        stations.slice(
          0,
          this.filters.cantidad
        );

      this.loading = false;

      this.cdr.detectChanges();

    });
  }

  getFuelProperty(): string {
    switch (this.filters.carburante) {
      case 'Gasolina 95 E5':
        return 'Precio Gasolina 95 E5';
      case 'Gasolina 98 E5':
        return 'Precio Gasolina 98 E5';
      case 'Gasóleo A':
        return this.stationType === 'terrestre'
          ? 'Precio Gasoleo A'
          : 'Precio Gasoleo A habitual';
      case 'Gasóleo Premium':
        return 'Precio Gasoleo Premium';
      case 'GLP':
        return 'Precio Gases licuados del petróleo';
      case 'Gasóleo marítimo':
        return 'Precio Gasóleo para uso marítimo';
      default:
        return 'Precio Gasolina 95 E5';
    }
  }

  getAvailableFuels(station: any) {
    return [
      {
        name: 'Gasolina 95 E5',
        price: station['Precio Gasolina 95 E5']
      },
      {
        name: 'Gasolina 98 E5',
        price: station['Precio Gasolina 98 E5']
      },
      {
        name: 'Gasóleo A',
        price: station['Precio Gasoleo A']
      },
      {
        name: 'Gasóleo B',
        price: station['Precio Gasoleo B']
      },
      {
        name: 'Gasóleo Premium',
        price: station['Precio Gasoleo Premium']
      }
    ].filter(
      fuel =>
        fuel.price &&
        fuel.price !== ''
    );

  }

  parsePrice(value: string): number {
    if (!value) {
      return Number.MAX_VALUE;
    }

    return parseFloat(
      value.replace(',', '.')
    );
  }

  onCommunityChange() {
    this.filters.provincia = '';
    this.provinciasFiltradas =
      CCAA_PROVINCIAS[
        this.filters.comunidad
      ] || [];
  }

  private getCurrentPosition(): Promise<GeolocationPosition> {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          position => {
            console.log('Accuracy:',position.coords.accuracy);
            resolve(position);
          },
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });
    }

  private toRadians(value: number): number {
    return value * Math.PI / 180;
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {

    const R = 6371;

    const dLat =
      this.toRadians(lat2 - lat1);

    const dLon =
      this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return R * c;
  }

  getDirectionsUrl(station: any): string {
    const lat =
      station['Latitud']
        .replace(',', '.');

    const lon =
      station['Longitud (WGS84)']
        .replace(',', '.');

    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
  }

}