export class UninitializedError extends Error {
    code = 400;
    message = 'Project has not been initialized';
    type = 'UNINITIALIZED';
    constructor(m?: string) {
        super(m);
        Object.setPrototypeOf(this, UninitializedError.prototype);
    }
}