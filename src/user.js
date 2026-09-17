export function User() {
    this.name = "";
    this.age = "";
}

User.prototype.askName = function () {
    this.name = prompt("Как вас зовут?");

    return this;
};

User.prototype.askAge = function () {
    this.age = prompt("Сколько вам лет?");

    return this;
};

User.prototype.showAgeInConsole = function () {
    console.log(this.age);

    return this;
};

User.prototype.showNameInAlert = function () {
    alert(this.name);

    return this;
};