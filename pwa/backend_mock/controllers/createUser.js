import User from '../models/User.js';

// const newUser = await createUser( address, address, ['user'], "Anonymous", "", "", "")
export default async function createUser(eAddr, username, roles, name, bio, pfp, nonce) {
    // const exist = await User.findOne({ eAddr })

    // if (exist) {
    //     throw new Error('A user with eAddr already exists');
    // }
    const newUser = new User({
        eAddr : eAddr,
        username : username,
        roles: roles,
        name : name,
        bio : bio,
        pfp : pfp,
        nonce : nonce 
    })
    // await newUser.save();
    return newUser
}