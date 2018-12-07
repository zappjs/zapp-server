import * as assert from 'assert';
import axios from 'axios';
import { Server } from 'http';

import { init } from '../..';

describe('loadFile', () => {
    let server: Server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        server.close();
    });

    it('should load file with path w/ leading slash', async () => {
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:12345/loadFile',
            data: {
                cwd: './src/tests/data/project-with-files',
                path: '/README.md'
            }
        });

        assert.deepStrictEqual(
            result.data,
            {
                content: '# project-with-files'
            }
        );
    });

    it('should load file with path w/o leading slash', async () => {
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:12345/loadFile',
            data: {
                cwd: './src/tests/data/project-with-files',
                path: 'README.md'
            }
        });

        assert.deepStrictEqual(
            result.data,
            {
                content: '# project-with-files'
            }
        );
    });
});