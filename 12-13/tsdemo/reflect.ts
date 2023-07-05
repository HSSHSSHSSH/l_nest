import 'reflect-metadata';

const metaObj: Record<string, string> = {};

Reflect.defineMetadata('name', '蛙叫你', metaObj);

console.log(Reflect.getMetadata('name', metaObj));

// 装饰器

function Type(type) {
  return Reflect.metadata('design:type', type);
}
function ParamTypes(...types) {
  console.log('paramsTypes', types);
  return Reflect.metadata('design:paramtypes', types);
}
function ReturnType(type) {
  return Reflect.metadata('design:returntype', type);
}

@ParamTypes(String, Number)
class A {
  text: string;
  i: number;
  constructor(text, i) {
    this.text = text;
    this.i = i;
  }

  @Type(String)
  get name() {
    return 'text';
  }

  // @Type(Function)
  // @ParamTypes(Number, Number)
  // @ReturnType(Number)
  add(x, y) {
    return x + y;
  }
}

// const obj = new A('a', 1);
// console.log(Reflect.getMetadata('design:paramtypes', obj, 'add'));
// console.log(Reflect.getMetadata('design:returntype', obj, 'add'));
// console.log(Reflect.getMetadata('design:type', obj, 'add'));
console.log('---');
console.log(Reflect.getMetadata('design:paramtypes', A));
