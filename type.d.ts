/// <reference types = "mongoose" />

declare module 'mongoose' {

  interface DocumentQuery<T, DocType extends Document> {
    throwIfEmpty(): this;
  }
}