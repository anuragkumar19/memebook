import { UserDocument } from './interfaces/mongoose.gen'

declare global {
    namespace Express {
        interface Request {
            user: UserDocument
        }
    }
}
