const Nonce = require('../models/Nonce');
import createNonce from './createNonce';


describe('Creating nonce', () => {
    it.only('Should not create a nonce, throw error when nonceId is not unique', async () => {
        Nonce.findOne = jest.fn().mockReturnValueOnce({
            nonceId: 12345
        });
        Nonce.prototype.save = jest.fn().mockImplementation(() => {});
        await expect(createNonce(12345, 423, 80008)).rejects.toThrowError();
    })


})
