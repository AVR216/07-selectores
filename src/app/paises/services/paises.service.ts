import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/pais.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
  private _baseUrl: string = 'https://restcountries.com/v2'; // /alpha/CU
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones() {
    return [...this._regiones]
  }

  constructor(private http: HttpClient) { }

  getPaisesPorRegion(region: string): Observable<PaisSmall[]> {
    const url = `${this._baseUrl}/region/${region}?fields=alpha3Code,name`;
    return this.http.get<PaisSmall[]>(url);
  }

  getPaisPorCodigo(code: string): Observable<Pais | null> {
    const url = `${this._baseUrl}/alpha/${code}`
    if (!code) {
      return of(null);
    }
    return this.http.get<Pais>(url);
  }

  getPaisPorCodigoSmall(code: string): Observable<PaisSmall> {
    const url = `${this._baseUrl}/alpha/${code}?fields=alpha3Code,name`
    return this.http.get<PaisSmall>(url);
  }

  getPaisesPorCodigo(borders: string[]): Observable<PaisSmall[]> {
    if (!borders) {
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];
    borders.forEach(code => {
      const peticion = this.getPaisPorCodigoSmall(code);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);
  }
}
