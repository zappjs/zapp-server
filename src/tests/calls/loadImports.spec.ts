import * as assert from 'assert';
import axios from 'axios';
import { Server } from 'http';

import init from '../..';

describe('loadImports', () => {
    let server: Server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        server.close();
    });

    it('should load imports', async () => {
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:12345/loadImports',
            data: {
                cwd: './src/tests/data/project-with-imports'
            }
        });

        assert.deepStrictEqual(
            result.data,
            {
                imports: [
                    {
                        specs: {
                            app: {
                                name: 'basic-generator'
                            }
                        }
                    }
                ]
            }
        );
    });
});