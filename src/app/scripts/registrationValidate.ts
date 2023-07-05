export const validatePassword = (password: string, confirmPassword: string) => {
    let passwordsMatch = true
    let hasNum = false
    let hasUpperCase = false
    let hasLowerCase = false

    passwordsMatch = password !== confirmPassword ? false : true

    function hasNumbers(password: string) {
        var regex = /\d/g;
        return regex.test(password);
    }
    hasNum = hasNumbers(password)

    for (let i = 0; i < password.length; i++) {
        if (hasNumbers(password[i])) {
            continue
        } else {
            password[i] === password[i].toUpperCase() ? hasUpperCase = true : hasLowerCase = true
        }
    }

    let result = hasNum && hasUpperCase && hasLowerCase && password.length >= 8

    return [result, passwordsMatch]
}

export const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const validateZipCode = (zipCode: string): boolean => {
    let tempZipCode: string | undefined = zipCode.match(/[^\s\-]+?/g)?.join("")
    var c
    if (tempZipCode) {
        c = (tempZipCode.length < 9) ? 5 : 9
        let re = new RegExp("^\\d{" + c + "}$")
        return re.test(String(tempZipCode))
    }
    else {
        return false
    }
}