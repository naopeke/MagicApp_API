class User {
    constructor(id_user, nameUser, emailUser, description, passwordUser, avatar, icon) { 
        this.id_user = id_user;
        this.nameUser = nameUser;
        this.emailUser = emailUser;
        this.description = description;
        this.passwordUser = passwordUser;
        this.avatar = avatar;
        this.icon = icon;
    }
}
module.exports = User;