export class UninitializedError extends Error {
    code = 400;
    message = 'Project has not been initialized';
    type = 'UninitializedError';
    constructor(m?: string) {
        super(m);
        if (m) {
            this.message = m;
        }
        Object.setPrototypeOf(this, UninitializedError.prototype);
    }
}