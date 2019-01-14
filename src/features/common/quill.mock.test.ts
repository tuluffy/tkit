import * as EventEmitter from 'eventemitter3';

type Source = 'api' | 'user' | 'silent';

class MockQuill extends EventEmitter {
  public selection: null | {
    index: number;
    length: number;
  } = null;
  public rangeMap: { [index: number]: any } = {};
  public value: string = '';
  public status: boolean;

  public clipboard = {
    dangerouslyPasteHTML: (value: string) => {
      this.value = value;
    }
  };

  public root: any = {};

  constructor(canvase: any, config: any) {
    super();
    if (config.readOnly) {
      this.status = false;
    }
    Object.defineProperty(this.root, 'innerHTML', {
      get: () => this.value
    });
  }

  public getLength() {
    return this.value.length + 1;
  }

  public getModule() {
    return {
      addHandler: (...args: any[]) => []
    };
  }

  public blur() {
    this.selection = null;
  }

  public getSelection() {
    return this.selection;
  }

  public setSelection(index: number, length: number, source?: Source) {
    this.selection = { index, length };
  }

  public getFormat(index: number, length: number) {
    return this.rangeMap[index] || null;
  }

  public formatText(index: number, length: number, formats: {}, source?: Source) {
    this.rangeMap[index] = { ...this.rangeMap[index], ...formats };
    while (length > 0) {
      length--;
      this.rangeMap[index + length] = { ...this.rangeMap[index + length], ...formats };
    }
  }

  public insertText(index: number, content: string, source?: Source) {
    this.value = `${this.value.substr(0, index)}${content}${this.value.substr(index)}`;
    this.emit('text-change', {}, {}, source);
  }

  public disable() {
    this.status = false;
  }

  public enable(status: boolean) {
    this.status = true;
  }
}

export default MockQuill;
