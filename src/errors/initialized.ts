export class InitializedError extends Error {
    code = 400;
    message = 'Project has been already initialized';
    type = 'InitializedError';
    constructor(m?: string) {
        super(m);
        if (m) {
            this.message = m;
        }
        Object.setPrototypeOf(this, InitializedError.prototype);
    }
}