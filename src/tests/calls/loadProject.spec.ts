import * as assert from 'assert';
import axios from 'axios';
import { Server } from 'http';

import { init } from '../..';

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

    it('should not load without cwd', async () => {
        try {
            await axios({
                method: 'POST',
                url: 'http://localhost:12345/loadProject'
            });

            assert.fail('request should fail');

        } catch (error) {
            assert.deepStrictEqual(
                error.response.data,
                {
                    type: 'InvalidError',
                    message: '"cwd" is required'
                }
            );
        }
    });

    it('should not load uninitialized project', async () => {
        try {
            await axios({
                method: 'POST',
                url: 'http://localhost:12345/loadProject',
                data: {
                    cwd: './src/tests/data/empty-project'
                }
            });

            assert.fail('request should fail');

        } catch (error) {
            assert.deepStrictEqual(
                error.response.data,
                {
                    type: 'UninitializedError',
                    message: 'Project has not been initialized'
                }
            );
        }
    });

    it('should not load unknown project', async () => {
        try {
            await axios({
                method: 'POST',
                url: 'http://localhost:12345/loadProject',
                data: {
                    cwd: './some/random/path'
                }
            });

            assert.fail('request should fail');

        } catch (error) {
            assert.deepStrictEqual(
                error.response.data,
                {
                    type: 'NotFoundError',
                    message: 'Directory not found'
                }
            );
        }
    });
});