const Users = require("./users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config");

class Auth {
  constructor() {
    //define esto así para que no tener que poner users = new Users() y luego utilizar el método users.getByEmail, pero esto tendría que ponerlo tanto en login como en signup (basicamente para no repetir código)
    this.users = new Users();
  }

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async getToken(user) {
    const data = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    const token = jwt.sign(data, jwt_secret, { expiresIn: "1d" });
    return { success: true, data, token };
  }

  async login(email, password) {
    const user = await this.users.getByEmail(email);
    if (user) {
      const correctPassword = await bcrypt.compare(password, user.password);
      if (correctPassword) {
        return this.getToken(user);
      } else {
        return { success: false, message: "Las credenciales no coinciden" };
      }
    }
    return { success: false, message: "Este correo no esta registrado" };
  }

  async signup(userData) {
    if (await this.users.getByFilter({ email: userData.email })) {
      return { succes: false, message: "Usuario ya registrado" };
    } else {
      userData.password = await this.hashPassword(userData.password);
      const user = await this.users.create(userData);
      return this.getToken(user);
    }
  }
}

module.exports = Auth;

/* 
EN EL CONTRUCTOR this.users = new Users();


async hashPassword(password) {
    //hago un salteado de 10
    const salt = await bcrypt.genSalt(10);
    // y luego eso se lo agrego al password la cual es llamado hash
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async signup(userData) {
    if (await this.users.getByFilter({ email: userData.email })) {
      return { success: false, message: "Usuario ya registrado" };
    } else {
      userData.password = await this.hashPassword(userData.password);
      const user = await this.users.create(userData);
      return user;
    }
  }

  async login(email, password) {
    const user = await this.users.getByEmail(email);
    if (user) {
      const correctPassword = await bcrypt.compare(password, user.password);
      if (correctPassword) {
        return user;
      } else {
        return { success: false, message: "Las credenciales no coinciden" };
      }
    }
    return { success: false, message: "Este correo no esta registrado" };
  }
















*/
