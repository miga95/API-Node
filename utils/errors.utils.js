module.exports.signUpErrors = (err) => {
    let errors = {username: '', email: "", password: ""}

    if(err.message.includes("username"))
        errors.username = "Username incorrect ou déjà pris";

    if(err.message.includes("email"))
        errors.email = "email incorrect";

    if(err.message.includes("password"))
        errors.password = "Le mot de passe doit faire 6 caractères minimum";    
     
    if(err.code===11000 && Object.keys(err.keyValue)[0].includes('username'))
        errors.username = "Ce nom d'utilisateur est déjà pris"    

    if(err.code===11000 && Object.keys(err.keyValue)[0].includes('email'))
        errors.email = "Cet email est déjà enregistré"   

    return errors;
    
}

module.exports.signInErrors = (err) => {
    let errors = {email: "", password: ""}
    if(err.message.includes("email"))
        errors.email = "Email inconnu"

    if(err.message.includes("password"))
        errors.password = "Le mot de passe ne correspond pas"    
    
    return errors;
}