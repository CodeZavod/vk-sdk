
import {Readable, ReadableOptions} from 'stream';
import {VKSDK} from './VKSDK';
import get = require('lodash.get');

export default class GenericStream extends Readable {
    public requestInProgress = false;

    private offset = 0;
    private externalBuffer = [];
    private boundErrorHandler = this.errorHandler.bind(this);

    constructor(opt: ReadableOptions, private sdk: VKSDK, public method: string, public body: any = {}) {
        super(opt);

        if (!this.body.count) {
            this.body.count = 10;
        }
    }

    public _read(size: number) {
        while (this.externalBuffer.length) {
            if (!this.push(this.externalBuffer.shift())) {
                return;
            }
        }

        if (this.requestInProgress) {
            return;
        }

        this.requestInProgress = true;

        this.getItems(this.offset).then((response: Response) => {
            this.requestInProgress = false;

            if (!response || !response.items || !response.items.length) {
                this.push(null);
                return;
            }

            this.offset += response.items.length;

            while (response.items.length) {
                if (!this.push(response.items.shift())) {
                    [].push.apply(this.externalBuffer, response.items);
                    break;
                }
            }
        }).catch(this.boundErrorHandler);
    }

    public async getItems(offset: number) {
        const body = Object.assign({}, this.body, {offset});

        return get(await this.sdk[this.method](body), 'response');
    }

    private errorHandler(err: Error) {
        this.requestInProgress = false;
        console.error('error on fetch', err, this.method, this.offset, this.body);
        process.nextTick(() => this.emit('error', err));
    }
}

export interface Response {
    count: number;
    items: any[];
}
