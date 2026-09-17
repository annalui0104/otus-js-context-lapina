export function ForceConstructor(name, age) {
    if (!(this instanceof ForceConstructor)) {
        return new ForceConstructor(name, age);
    }

    this.name = name;
    this.age = age;
}