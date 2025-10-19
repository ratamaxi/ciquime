// src/app/pipes/fix-utf8.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fixUtf8',   standalone: true })
export class FixUtf8Pipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (value == null) return '';
    try {
      // Relee los "bytes" Latin-1 como UTF-8
      const bytes = new Uint8Array([...value].map(ch => ch.charCodeAt(0)));
      return new TextDecoder('utf-8').decode(bytes);
    } catch {
      return value;
    }
  }
}
