type EnumType = Record<string, string | number>
type EnumKeys<E> = keyof E
type EnumValues<E> = E[keyof E]

type ConfigType<E extends EnumType> = {
  enumObj : E
}
class TestClass<E extends EnumType> {
  private enumObj: E;

  constructor(config : ConfigType<E>) {
  }

  method(): E[keyof E] {
    return
  }

  // Type of the keys: "Success" | "Failure"
  getKeys(): Array<keyof E> {
    return Object.keys(this.enumObj) as Array<keyof E>
  }

  getAllValues() {
    return Object.values(this.enumObj) as Array<E[keyof E]>
  }
}

enum Animal {
  Dog,
  Cat
}


const instance = new TestClass({
  enumObj: Animal
})

const values = instance.getAllValues()
const keys = instance.getKeys()
