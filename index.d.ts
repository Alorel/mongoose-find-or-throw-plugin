/// <reference types = "mongoose" />

export declare interface MongooseDocumentNotFoundError extends Error {
  message: 'Not found';
  name: 'MongooseDocumentNotFoundError';
  status: 404;
}

declare module 'mongoose' {

  interface DocumentQuery<T, DocType extends Document> {
    throwIfEmpty(): this;
  }
}