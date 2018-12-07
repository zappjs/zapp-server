import * as assert from 'assert';
import axios from 'axios';
import { Server } from 'http';

import init from '../..';

describe('loadProject', () => {
    let server: Server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        server.close();
    });

    it('should load project', async () => {
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:12345/loadProject',
            data: {
                cwd: './src/tests/data/basic-project'
            }
        });

        assert.deepStrictEqual(
            result.data,
            {
                project: {
                    specs: {
                        app: {
                            name: 'test'
                        }
                    }
                }
            }
        );
    });

    it('should not load uninitialized project', async () => {
        try {
            await axios({
                method: 'POST',
                url: 'http://localhost:12345/loadProject'
            });

        } catch (error) {
            assert.deepStrictEqual(
                error.response.data,
                {
                    type: 'UNINITIALIZED',
                    message: 'Project has not been initialized'
                }
            );
        }
    });
});