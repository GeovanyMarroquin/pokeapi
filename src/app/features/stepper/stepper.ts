import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { StepperService } from '@core/services/stepper';
import { PerfilFormService } from '@core/services/perfil-form';
import { LoaderComponent } from '@shared/components/loader/loader';
import { EscogerPokemonService } from '@core/services/escoger-pokemon';

@Component({
  selector: 'app-stepper',
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './stepper.html',
  styleUrls: ['./stepper.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Stepper implements OnDestroy {
  readonly stepper = inject(StepperService);
  private readonly perfilForm = inject(PerfilFormService);
  private readonly escogerPokemon = inject(EscogerPokemonService);
  private readonly router = inject(Router);

  readonly puedeAvanzar = computed(() => {
    if (this.stepper.currentStep() === 0) {
      return this.perfilForm.formularioValido();
    }
    if (this.stepper.currentStep() === 1) {
      return (
        this.escogerPokemon.pokemonesSeleccionados().size ===
        this.escogerPokemon.TOTAL_POKEMON_REQUERIDOS
      );
    }

    return true;
  });

  private limpiarDatos() {
    this.perfilForm.form.reset();
    this.escogerPokemon.pokemonesSeleccionados.set(new Map());
    this.perfilForm.fotoUrl.set('images/logo-ash.png');
  }

  finalizar() {
    this.limpiarDatos();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.limpiarDatos();
  }
}
