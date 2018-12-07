export class NotFoundError extends Error {
    code = 404;
    message = 'Not found';
    type = 'NotFoundError';
    constructor(m?: string) {
        super(m);
        if (m) {
            this.message = m;
        }
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}