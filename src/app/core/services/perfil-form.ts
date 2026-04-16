import { computed, effect, inject, Injectable, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { SelectOption } from '@core/interfaces/select';
import { PerfilEntrenador } from '@core/interfaces/perfil-entrenador';

@Injectable({ providedIn: 'root' })
export class PerfilFormService {
  private readonly fb = inject(FormBuilder);
  readonly perfilEntrenador = computed(() => this.formatearDatos());
  readonly fotoUrl = signal<string>('images/logo-ash.png');

  readonly selectOptions: SelectOption[] = [
    { label: 'Jugar futbol', value: 'opcion1' },
    { label: 'Leer libros', value: 'opcion2' },
    { label: 'Ver películas', value: 'opcion3' },
    { label: 'Escuchar música', value: 'opcion4' },
    { label: 'Correr', value: 'opcion5' },
    { label: 'Ir al cine', value: 'opcion6' },
  ];

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
    pasatiempo: [[] as string[]],
    cumpleanos: ['', Validators.required],
    documento: ['', Validators.maxLength(15)],
  });

  private readonly valorCumpleanos = toSignal(this.form.controls.cumpleanos.valueChanges, {
    initialValue: this.form.controls.cumpleanos.value,
  });

  private readonly estadoFormulario = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  readonly formularioValido = computed(() => this.estadoFormulario() === 'VALID');

  readonly esAdulto = computed(() => {
    const val = this.valorCumpleanos();
    if (!val) return false;
    return this.calcularEdad(val) >= 18;
  });

  constructor() {
    effect(() => {
      const ctrl = this.form.controls.documento;
      if (this.esAdulto()) {
        ctrl.setValidators([Validators.required, Validators.maxLength(15), this.formatoDui()]);
      } else {
        ctrl.clearValidators();
        ctrl.setValue('');
      }
      ctrl.updateValueAndValidity();
    });
  }

  formatoDui(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value as string;
      if (!valor) return null;
      const valido = /^\d{8}-\d$/.test(valor);
      return valido ? null : { formatoDocumento: { valor } };
    };
  }

  calcularEdad(cumpleanos: string): number {
    const birth = new Date(cumpleanos);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const hadBirthday =
      today.getMonth() > birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
    if (!hadBirthday) {
      age--;
    }
    return age;
  }

  formatearDatos(): PerfilEntrenador {
    const partialForm: PerfilEntrenador = this.form.value as PerfilEntrenador;
    const opcionesSeleccionadas = this.selectOptions
      .filter((o) => partialForm.pasatiempo?.includes(o.value))
      .map((o) => o.label);

    const copiaFormulario: PerfilEntrenador = { ...partialForm };
    copiaFormulario.pasatiempo = opcionesSeleccionadas;
    copiaFormulario.edad = this.calcularEdad(partialForm.cumpleanos);

    return copiaFormulario;
  }

  seleccionarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.fotoUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
}
