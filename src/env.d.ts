declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      PORT: string;
      MONGO_URI: string;
      SMTP_HOST: string;
      SMTP_PORT: string;
      EMAIL: string;
      EMAIL_PASSWORD: string;
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
      CLOUDINARY_FOLDER: string;
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
      DEFAULT_AVATAR: string;
    }
  }
}

export {}
