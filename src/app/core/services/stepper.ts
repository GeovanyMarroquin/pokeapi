import { inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { delay, filter, map, of, startWith } from 'rxjs';

export interface Step {
  label: string;
  path: string;
}

@Injectable({ providedIn: 'root' })
export class StepperService {
  readonly steps: Step[] = [
    { label: 'Crear perfil', path: 'crear-perfil' },
    { label: 'Escoger Pokémon', path: 'escoger-pokemon' },
    { label: 'Ver perfil completo', path: 'ver-perfil-completo' },
  ];

  private readonly router = inject(Router);
  private readonly basePath = '/entrenador';
  readonly isLoading = signal(false);

  readonly currentStep = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => this.stepFromUrl((e as NavigationEnd).urlAfterRedirects)),
      startWith(this.stepFromUrl(this.router.url)),
    ),
    { initialValue: 0 },
  );

  private stepFromUrl(url: string): number {
    const idx = this.steps.findIndex((s) => url.includes(s.path));
    return idx >= 0 ? idx : 0;
  }

  next(): void {
    const next = this.currentStep() + 1;
    if (next < this.steps.length) {
      this.isLoading.set(true);
      this.ocultarLoader(this.steps[next].path);
    }
  }

  back(): void {
    const prev = this.currentStep() - 1;
    if (prev >= 0) {
      this.isLoading.set(true);
      this.ocultarLoader(this.steps[prev].path);
    }
  }

  ocultarLoader(path: string): void {
    of(true)
      .pipe(delay(800))
      .subscribe(() => {
        this.router.navigate([this.basePath, path]).finally(() => {
          this.isLoading.set(false);
        });
      });
  }
}
