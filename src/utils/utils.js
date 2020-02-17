export function userInfo(user) {
    return user.name + " " + user.surname;
}

export function isEmpty(data) {
    if (typeof (data) === 'object') {
        if (JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]') {
            return true;
        } else if (!data) {
            return true;
        }
        return false;
    } else if (typeof (data) === 'string') {
        return !data.trim();

    } else return typeof (data) === 'undefined';
}
