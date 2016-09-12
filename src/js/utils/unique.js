export function unique (vector) {

    let dictionary = {}
    let newVector = []

    for ( let i = 0; i < vector.length; i++ ) {
        dictionary[vector[i] + ""] = true;
    }

    for (let key in dictionary) {
        newVector.push(key);
    }

    return newVector;
}
