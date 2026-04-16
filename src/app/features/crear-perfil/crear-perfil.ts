import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PerfilFormService } from '../../core/services/perfil-form';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-crear-perfil',
  imports: [ReactiveFormsModule],
  templateUrl: './crear-perfil.html',
  styleUrls: ['./crear-perfil.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrearPerfil {
  private readonly perfilForm = inject(PerfilFormService);
  readonly formGroup = this.perfilForm.form;
  readonly selectOptions = this.perfilForm.selectOptions;
  readonly esAdulto = this.perfilForm.esAdulto;
  readonly fotoUrl = this.perfilForm.fotoUrl;
  readonly hoy = new Date().toISOString().split('T')[0];

  private readonly valorPasatiempo = toSignal(this.formGroup.controls.pasatiempo.valueChanges, {
    initialValue: this.formGroup.controls.pasatiempo.value ?? [],
  });

  readonly pasatiemposSeleccionados = computed(() => this.valorPasatiempo() ?? []);

  readonly opcionesDisponibles = computed(() =>
    this.selectOptions.filter((o) => !this.pasatiemposSeleccionados().includes(o.value)),
  );

  mostrarChip(valor: string): string {
    return this.selectOptions.find((o) => o.value === valor)?.label ?? valor;
  }

  agregarPasatiempo(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const valor = select.value;
    if (!valor) return;
    const actuales = this.formGroup.controls.pasatiempo.value ?? [];
    if (!actuales.includes(valor)) {
      this.formGroup.controls.pasatiempo.setValue([...actuales, valor]);
    }
    select.value = '';
  }

  eliminarPasatiempo(valor: string): void {
    const actuales = this.formGroup.controls.pasatiempo.value ?? [];
    this.formGroup.controls.pasatiempo.setValue(actuales.filter((v) => v !== valor));
  }

  aplicarMascaraDocumento(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 9);
    const masked = digits.length > 8 ? `${digits.slice(0, 8)}-${digits.slice(8)}` : digits;
    this.formGroup.controls.documento.setValue(masked);
    input.value = masked;
  }

  seleccionarFoto(event: Event): void {
    this.perfilForm.seleccionarFoto(event);
  }

  enviar(): void {
    if (this.formGroup.valid) {
      console.log(this.formGroup.value);
    }
  }
}
