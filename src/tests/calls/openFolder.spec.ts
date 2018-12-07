import * as assert from 'assert';
import axios from 'axios';
import { Server } from 'http';

import { init } from '../..';

describe.skip('openFolder', () => {
    let server: Server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        server.close();
    });

    it('should open folder', async () => {
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:12345/openFolder',
            data: {
                cwd: './src/tests/data/project-with-imports'
            }
        });

        assert.deepStrictEqual(
            result.data,
            {}
        );
    });
});