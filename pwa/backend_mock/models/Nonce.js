import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const nonceSchema = new Schema (
    {
        nonceId: {
            type: Number
        },
        transactionId: {
            type: String
        },
        nonce: {
            type: Number
        }
    }
)

export default mongoose.model('Nonce', nonceSchema);