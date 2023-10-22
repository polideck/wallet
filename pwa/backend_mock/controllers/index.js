import express from 'express';
// import Nonce from '../models/Nonce';
import createNonce from './createNonce';
const router = express.Router();

router.post('/create', async (req, res) => {
    const { nonceId, transactionId, nonce } = req.body
    try {
        const newNonce = await createNonce( nonceId, transactionId, nonce );
        return newNonce
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
})

export default router;