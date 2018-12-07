import * as assert from 'assert';
import axios from 'axios';
import { Server } from 'http';

import init from '../..';

describe('listFiles', () => {
    let server: Server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        server.close();
    });

    it('should list files', async () => {
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:12345/listFiles',
            data: {
                cwd: './src/tests/data/project-with-files'
            }
        });

        assert.deepStrictEqual(
            result.data,
            {
                items: [
                    {
                        isEmpty: false,
                        name: 'README.md',
                        type: 'file'
                    }
                ]
            }
        );
    });
});