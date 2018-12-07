export class InvalidError extends Error {
    code = 400;
    message = 'Invalid request body';
    type = 'InvalidError';
    constructor(m?: string) {
        super(m);
        if (m) {
            this.message = m;
        }
        Object.setPrototypeOf(this, InvalidError.prototype);
    }
}