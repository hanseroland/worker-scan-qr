export function Log() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      console.log(`[${propertyKey}] appelé avec`, args);
      const result = await originalMethod.apply(this, args);
      console.log(`[${propertyKey}] résultat`, result);
      return result;
    };

    return descriptor;
  };
}

export function Entity(tableName: string) {
  return function (target: Function) {
    // Attache le nom de la table à la classe comme métadonnée
    Reflect.defineMetadata('tableName', tableName, target);
  };
}
