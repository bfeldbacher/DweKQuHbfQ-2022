import { Component, VERSION } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  zones = [65, 91, 110, 130, 156, 175, 195];
  colorIds = [1, 2, 3, 4, 3, 2];
  colors = [
    [109, 70, 123], // 1 = violett
    [196, 84, 34], // 2 = red
    [252, 218, 92], // 3 = yellow
    [50, 187, 22], // 4 = green
  ];
  gradientWidth = 10;

  getColor(pulse: number, gradient = false): string {
    let hex = gradient
      ? this.getColorAsHexArrayWithGradient(pulse)
      : this.getColorAsHexArray(pulse);
    return 'rgb(' + hex.join(',') + ')';
  }

  getColorAsHexArray(pulse: number): number[] {
    // anything below lowest belong to first zone. no gradient
    if (pulse < this.zones[0]) {
      return this.colorIdToColor(0);
    }

    // iterate through zones
    for (let i = 0; i < this.zones.length - 1; i++) {
      if (this.zones[i] <= pulse && pulse < this.zones[i + 1]) {
        return this.colorIdToColor(i);
      }
    }

    return this.colorIdToColor(this.colorIds.length - 1);
  }

  getColorAsHexArrayWithGradient(pulse: number): number[] {
    let halfGradientWidth = this.gradientWidth / 2;
    // anything below lowest belong to first zone. no gradient
    if (pulse < this.zones[0]) {
      return this.colorIdToColor(0);
    }

    // iterate through zones
    for (let i = 0; i < this.zones.length - 1; i++) {
      // gradient at end of zone
      if (
        i + 2 < this.zones.length &&
        this.zones[i + 1] - halfGradientWidth <= pulse &&
        pulse < this.zones[i + 1]
      ) {
        let weight = (this.zones[i + 1] - pulse) / halfGradientWidth / 2 + 0.5;
        return this.pickHex(
          this.colorIdToColor(i),
          this.colorIdToColor(i + 1),
          weight
        );
      }

      // gradient at start of zone
      if (
        i - 1 >= 0 &&
        this.zones[i] <= pulse &&
        pulse < this.zones[i] + halfGradientWidth
      ) {
        let weight = (1 - (pulse - this.zones[i]) / halfGradientWidth) / 2;
        return this.pickHex(
          this.colorIdToColor(i - 1),
          this.colorIdToColor(i),
          weight
        );
      }

      // todo handle zones smaller than gradient width
      if (this.zones[i] <= pulse && pulse < this.zones[i + 1]) {
        return this.colorIdToColor(i);
      }
    }

    return this.colorIdToColor(this.colorIds.length - 1);
  }

  colorIdToColor(index: number): number[] {
    return this.colors[this.colorIds[index] - 1];
  }

  iterable(): number[] {
    return Array.from(Array(150).keys()).map((i) => Math.abs(i - 200));
  }

  // see https://stackoverflow.com/a/30144587/15783109
  pickHex(color1: number[], color2: number[], weight: number): number[] {
    let w1 = weight;
    let w2 = 1 - w1;
    let rgb = [
      Math.round(color1[0] * w1 + color2[0] * w2),
      Math.round(color1[1] * w1 + color2[1] * w2),
      Math.round(color1[2] * w1 + color2[2] * w2),
    ];
    return rgb;
  }
}
