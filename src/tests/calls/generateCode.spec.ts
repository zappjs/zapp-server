import * as assert from 'assert';
import axios from 'axios';
import * as fs from 'fs';
import { Server } from 'http';

import { init } from '../..';

describe('generateCode', () => {
    let server: Server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        server.close();
    });

    it('should generate code', async () => {
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:12345/generateCode',
            data: {
                cwd: './src/tests/data/empty-project',
                project: {
                    files: {
                        readme: {
                            engine: 'handlebars',
                            filename: 'README.md',
                            mapping: {
                                name: '/app/name'
                            },
                            template: 'readme'
                        }
                    },
                    specs: {
                        app: {
                            name: 'empty-project'
                        }
                    },
                    templates: {
                        readme: {
                            template: '# {{{name}}}'
                        }
                    }
                }
            }
        });

        assert.deepStrictEqual(
            result.data,
            {}
        );

        assert.strictEqual(
            fs.readFileSync('./src/tests/data/empty-project/README.md', 'utf-8'),
            '# empty-project\n'
        );

        fs.unlinkSync('./src/tests/data/empty-project/README.md');
    });
});