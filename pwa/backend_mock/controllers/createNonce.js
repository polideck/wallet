import Nonce from '../models/Nonce.js';

export default async function createNonce(nonceId, transactionId, nonce) {
    const exist = await Nonce.findOne({ nonceId })

    if (exist) {
        throw new Error('A nonce with nonceId already exists');
    }

    const newNonce = new Nonce({
        nonceId,
        transactionId,
        nonce
    })
    await newNonce.save();
    return {
        newNonce: newNonce
    }
}