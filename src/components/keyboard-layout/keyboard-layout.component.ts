import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  input,
  signal,
} from '@angular/core';
import {
  KeyboardLayout,
  KeyboardLayoutKey,
  KeyCode,
  WSKCode,
} from 'tangent-cc-lib';

const WSK_CODE_SET = new Set<WSKCode>([
  'Backquote',
  'Backslash',
  'BracketLeft',
  'BracketRight',
  'Comma',
  'Digit0',
  'Digit1',
  'Digit2',
  'Digit3',
  'Digit4',
  'Digit5',
  'Digit6',
  'Digit7',
  'Digit8',
  'Digit9',
  'Equal',
  'IntlBackslash',
  'IntlRo',
  'IntlYen',
  'KeyA',
  'KeyB',
  'KeyC',
  'KeyD',
  'KeyE',
  'KeyF',
  'KeyG',
  'KeyH',
  'KeyI',
  'KeyJ',
  'KeyK',
  'KeyL',
  'KeyM',
  'KeyN',
  'KeyO',
  'KeyP',
  'KeyQ',
  'KeyR',
  'KeyS',
  'KeyT',
  'KeyU',
  'KeyV',
  'KeyW',
  'KeyX',
  'KeyY',
  'KeyZ',
  'Minus',
  'Period',
  'Quote',
  'Semicolon',
  'Slash',
]);

function generateKeyboard(keyboardLayout: KeyboardLayout) {
  const keySize = 10;
  const gap = 1;
  const step = (keySize + gap) / 3;
  const keyboardWidth = 14 * keySize + (14 - 1) * gap + step;
  const keyboardHeight = 5 * keySize + (5 - 1) * gap;
  const keyMatrix: KeyCode[][] = [
    [
      'Backquote',
      'Digit1',
      'Digit2',
      'Digit3',
      'Digit4',
      'Digit5',
      'Digit6',
      'Digit7',
      'Digit8',
      'Digit9',
      'Digit0',
      'Minus',
      'Equal',
      'Backspace',
    ],
    [
      'Tab',
      'KeyQ',
      'KeyW',
      'KeyE',
      'KeyR',
      'KeyT',
      'KeyY',
      'KeyU',
      'KeyI',
      'KeyO',
      'KeyP',
      'BracketLeft',
      'BracketRight',
      'Backslash',
    ],
    [
      'CapsLock',
      'KeyA',
      'KeyS',
      'KeyD',
      'KeyF',
      'KeyG',
      'KeyH',
      'KeyJ',
      'KeyL',
      'Semicolon',
      'Quote',
      'Backslash',
      'Enter',
    ],
    [
      'ShiftLeft',
      'IntlBackslash',
      'KeyZ',
      'KeyX',
      'KeyC',
      'KeyV',
      'KeyB',
      'KeyN',
      'KeyM',
      'Comma',
      'Period',
      'Slash',
      'ShiftRight',
    ],
    [
      'ControlLeft',
      'MetaLeft',
      'AltLeft',
      'SpaceLeft',
      'SpaceRight',
      'AltRight',
      'MetaRight',
      'ContextMenu',
      'ControlRight',
    ],
  ];
  const backspaceAndTabWidth = keySize + step;
  const capsLockAndEnterWidth = (keyboardWidth - 11 * keySize - 12 * gap) / 2;
  const shiftTotalWidth = keyboardWidth - 11 * keySize - 12 * gap;
  const shiftLeftWidth = keySize + 3 * step - keySize - gap;
  const shiftRightWidth = shiftTotalWidth - shiftLeftWidth;
  const spaceLeftWidth = 3 * keySize + (3 - 1) * gap;
  const spaceRightWidth = 2 * keySize + (2 - 1) * gap;
  const rowFiveOtherKeyWidth =
    (keyboardWidth - spaceLeftWidth - spaceRightWidth - 8 * gap) / 7;
  const keyWidthMap: Partial<Record<KeyCode, number>> = {
    Backspace: backspaceAndTabWidth,
    Tab: backspaceAndTabWidth,
    CapsLock: capsLockAndEnterWidth,
    Enter: capsLockAndEnterWidth,
    ShiftLeft: shiftLeftWidth,
    ShiftRight: shiftRightWidth,
    SpaceLeft: spaceLeftWidth,
    SpaceRight: spaceRightWidth,
    ControlLeft: rowFiveOtherKeyWidth,
    MetaLeft: rowFiveOtherKeyWidth,
    AltLeft: rowFiveOtherKeyWidth,
    AltRight: rowFiveOtherKeyWidth,
    MetaRight: rowFiveOtherKeyWidth,
    ContextMenu: rowFiveOtherKeyWidth,
    ControlRight: rowFiveOtherKeyWidth,
  };
  let y = 0;
  const keys: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    key: Partial<KeyboardLayoutKey> | null;
  }> = [];
  keyMatrix.forEach((row) => {
    let x = 0;
    row.forEach((keyCode) => {
      const width = keyWidthMap[keyCode] ?? keySize;
      const key = keyboardLayout.layout[keyCode as any as WSKCode] ?? null;
      keys.push({ key, x, y, width, height: keySize });
      x += width + gap;
    });
    y += keySize + gap;
  });
  return {
    width: keyboardWidth,
    height: keyboardHeight,
    keys,
  };
}

@Component({
  selector: 'app-keyboard-layout',
  standalone: true,
  templateUrl: './keyboard-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyboardLayoutComponent {
  readonly withShift = input(false);
  readonly withAltGraph = input(false);
  readonly keyboardLayout = signal<KeyboardLayout>({
    id: 'temp',
    name: 'Temp',
    reference: '',
    layout: {},
  });
  keyboard = computed(() => {
    const keyboardLayout = this.keyboardLayout();
    if (!keyboardLayout) {
      return null;
    }
    return generateKeyboard(keyboardLayout);
  });
  isAltGraphHeld = signal(false);
  isShiftHeld = signal(false);

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    event.preventDefault();
    if (event.key === 'AltGraph' || event.code === 'AltRight') {
      this.isAltGraphHeld.set(true);
    } else if (WSK_CODE_SET.has(event.code as WSKCode)) {
      const isAltGraphHeld = this.isAltGraphHeld();
      const isShiftHeld = event.shiftKey;
      const key: keyof KeyboardLayoutKey = isAltGraphHeld
        ? isShiftHeld
          ? 'withShiftAltGraph'
          : 'withAltGraph'
        : isShiftHeld
          ? 'withShift'
          : 'unmodified';
      console.log(isAltGraphHeld, key);
      const layout = this.keyboardLayout();
      layout.layout[event.code as WSKCode] = {
        ...(layout.layout[event.code as WSKCode] ?? {}),
        [key]: { type: 'text', value: event.key },
      };
      this.keyboardLayout.set({ ...layout });
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    event.preventDefault();
    if (event.key === 'AltGraph' && event.code === 'AltRight') {
      this.isAltGraphHeld.set(false);
    }
  }
}
