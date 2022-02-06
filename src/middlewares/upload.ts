import multer from 'multer'
import crypto from 'crypto'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import asyncHandler from 'express-async-handler'
import cloudinary from '../config/cloudinary.js'

//  Multer Cloudinary Storage for post's images
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: `${process.env.CLOUDINARY_FOLDER}`,
        public_id: () => crypto.randomBytes(16).toString('hex'),
        type: 'upload',
        resource_type: 'auto',
    },
})

export const upload = (
    type,
    field,
    multiple,
    sizeLimit = 50 * 1024 * 1024 // 50MB
) =>
    asyncHandler((req, res, next) => {
        const uploaderAlt = multer({
            storage,
            limits: {
                fieldSize: sizeLimit,
            },
            fileFilter: (_req, file, cb) => {
                if (type !== 'any' && !file.mimetype.startsWith(type)) {
                    cb(new Error(`Please upload ${type} Only!`))
                } else {
                    cb(null, true)
                }
            },
        })

        let uploader

        if (multiple) {
            uploader = uploaderAlt.array(field)
        } else {
            uploader = uploaderAlt.single(field)
        }

        return new Promise((resolve, reject) => {
            uploader(req, res, (err) => {
                res.status(400)
                if (err) {
                    return reject(new Error(err))
                }

                if (multiple && (!req.files || req.files.length === 0)) {
                    return reject(new Error(`Please select an ${type}`))
                }

                if (!multiple && !req.file) {
                    return reject(new Error(`Please select an ${type}`))
                }

                res.status(200)
                next()
                resolve(multiple ? req.files : req.file)
            })
        })
    })
