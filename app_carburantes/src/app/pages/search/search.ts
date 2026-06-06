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
    this.filters.provincia = '';
    if (this.stationType === 'maritima') {
      this.provinciasFiltradas = this.todasLasProvincias;
    } else {
      this.provinciasFiltradas = [];
    }
  }

  get carburantes() {
    return this.stationType === 'terrestre'
      ? CARBURANTES_TERRESTRES
      : CARBURANTES_MARITIMOS;
  }

  filters = {
    comunidad: '',
    provincia: '',
    carburante: '',
    fecha: '',
    cantidad: 10,
    orden: 'asc'
  };

  private fuelService = inject(FuelService);
  results: any[] = [];
  loading = false;

  search() {
    this.loading = true;

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

      // LIMITAR RESULTADOS

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


}