import * as assert from 'assert';
import axios from 'axios';
import * as fs from 'fs-extra';
import { Server } from 'http';
import * as yaml from 'js-yaml';

import init from '../..';

describe('saveProject', () => {
    let server: Server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        server.close();
    });

    it('should save project', async () => {
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:12345/saveProject',
            data: {
                cwd: './src/tests/data/empty-project',
                project: {
                    specs: {
                        app: {
                            name: 'test'
                        }
                    }
                }
            }
        });

        assert.deepStrictEqual(
            result.data,
            {}
        );

        assert.deepStrictEqual(
            yaml.safeLoad(
                fs.readFileSync('./src/tests/data/empty-project/.zapp/specs/app.yml', 'utf-8')
            ),
            {
                name: 'test'
            }
        );

        fs.removeSync('./src/tests/data/empty-project/.zapp');
    });
});