import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, tap } from 'rxjs';

import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/pais.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  })

  //llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  //fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  //UI
  cargando: boolean = false;

  constructor(private fb: FormBuilder,
    private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    //cuando cambie la region
    /*  this.miFormulario.get('region')?.valueChanges
       .subscribe(region => {
         console.log(region);
         this.paisesService.getPaisesPorRegion(region)
           .subscribe(paises => {
             console.log(paises);
             this.paises = paises
           })
       }); */

    //Lo mismo que está comentareado pero mas ordenado y usando operadores de rxjs
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap(_ => {
          this.miFormulario.get('pais')?.reset('')
          this.cargando = true;
        }), //
        switchMap(region => this.paisesService.getPaisesPorRegion(region)) // recibe el resultado de un observable  y devuelve otro
      )
      .subscribe(paises => {
        this.paises = paises
        this.cargando = false;
      });

    //llenar el campo de fronteras
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(() => {
          this.miFormulario.get('frontera')?.reset('')
          this.cargando = true;
        }),
        switchMap(code => this.paisesService.getPaisPorCodigo(code)),
        switchMap( pais => this.paisesService.getPaisesPorCodigo ( pais?.borders! ) )
      )
      .subscribe(paises => {
        //this.fronteras = pais?.borders || [];
        this.fronteras = paises;
        this.cargando = false;
      });
  }

  guardar() {
    console.log(this.miFormulario.value);
  }
}
