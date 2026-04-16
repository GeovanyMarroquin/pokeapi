import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'shared-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  isVisible = input(false);
}
