import User from '../models/User.js';

// const newUser = await createUser( address, address, ['user'], "Anonymous", "", "", "")
export default async function createUser(eAddr, username, roles, name, bio, pfp, nonce) {
    const newUser = new User({
        eAddr : eAddr,
        username : username,
        roles: roles,
        name : name,
        bio : bio,
        pfp : pfp,
        nonce : nonce 
    })
    return newUser
}