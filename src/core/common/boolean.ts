export interface Boolean {
  bool(): boolean;
}

export class BooleanLiteral implements Boolean {
  constructor(private value: boolean) {}

  bool(): boolean {
    return this.value;
  }
}

export class And implements Boolean {
  private values: Boolean[]

  constructor(
    ...args: Boolean[]
  ) {
    this.values = args;
  }

  bool(): boolean {
    return this.values.reduce((acc, value) => acc && value.bool(), false);
  }
}
