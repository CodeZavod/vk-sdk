
import * as util from 'util';
import * as https from 'https';
import {RequestOptions} from 'https';
import {OutgoingHttpHeaders} from 'http';
import * as querystring from 'querystring';

import * as uuid from 'uuid';

import Errors from './Errors';
import {VKSDK} from './VKSDK';
import {VKGenericResponse} from './GenericStream';

const debugLog = util.debuglog('vk-sdk'),
    defaultRequestOptions: RequestOptions = {
        timeout: 60000,
    },
    successStatusCodes = new Set([200, 201, 202, 204, 304]),
    log = debugLog.bind(debugLog, 'Request: ');

export class Request<TBody> {
    public static isErrorResp(resJSON: VKResp<any>): resJSON is VKErrorResp {
        return !!(resJSON as VKErrorResp).error;
    }

    private static headers: OutgoingHttpHeaders = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-agent': 'nodejs',
    };
    private static minRequestsInterval = 1000 / 2; // max 2 requests in sec

    private method: string;
    private sdk: VKSDK;
    private requestId = uuid.v4();
    private body = {};
    private bodyDefault = {};
    private checkStatusCode = true;
    private repeatOnLimitError = true;
    private boundRequest: () => void;

    constructor(method: string, sdk: VKSDK) {
        this.method = method;
        this.sdk = sdk;
        this.bodyDefault = {
            lang: this.sdk.options.language,
            v: this.sdk.options.version,
            https: (this.sdk.options.https) ? 1 : 0,
        };
    }

    public setBody(body: object) {
        this.body = body;
        return this;
    }

    public setRepeatOnLimitError(repeat: boolean) {
        this.repeatOnLimitError = repeat;
        return this;
    }

    public setCheckStatusCode(check: boolean) {
        this.checkStatusCode = check;
        return this;
    }

    public send(): Promise<VKResp<TBody>> {
        const authData: any = {};

        if (this.sdk.options.secure) {
            if (this.sdk.token) {
                authData.access_token = this.sdk.token;
            }

            if (this.sdk.options.appSecret) {
                authData.client_secret = this.sdk.options.appSecret;
            }
        }

        const bodyObj: object = Object.assign(
                {},
                this.bodyDefault,
                authData,
                this.body,
            ),
            body = querystring.stringify(bodyObj),
            headers: OutgoingHttpHeaders = Object.assign(
                {},
                Request.headers,
                {'Content-Length': Buffer.byteLength(body)},
            ),
            requestOptions: RequestOptions = Object.assign({}, defaultRequestOptions, {
                host: 'api.vk.com',
                port: 443,
                path: '/method/' + this.method,
                method: 'POST',
                headers,
            });

        log(`(${this.requestId}) Request.send: request with body:`, bodyObj);
        log(`(${this.requestId}) Request.send: request with params:`, requestOptions);

        return new Promise((resolve, reject) => {
            this.boundRequest = this.request.bind(this, requestOptions, body, resolve, reject);

            this.waitForNextRequest(this.boundRequest);
        });
    }

    private request(
        requestOptions: RequestOptions,
        body: string,
        resolve: (value?: any) => void,
        reject: (reason?: any) => void,
    ) {
        this.sdk.requestsInProgress++;

        const req = https.request(requestOptions, (res) => {
            const apiResponse: string[] = [];

            res.setEncoding('utf8');

            res.on('data', (chunk) => {
                apiResponse.push(chunk.toString());
            });

            res.on('end', () => {
                this.sdk.requestsInProgress--;

                log(`(${this.requestId}) Request.send: response statusCode:`, res.statusCode);
                log(`(${this.requestId}) Request.send: response headers:`, res.headers);

                let resJSON: VKResp<TBody>;

                try {
                    resJSON = JSON.parse(apiResponse.join(''));
                } catch (err) {
                    err.res = {requestId: this.requestId};
                    reject(err);

                    return;
                }

                if (this.checkStatusCode && !successStatusCodes.has(res.statusCode as number)) {
                    const invalidStatusCodeError = new Errors.InvalidStatusCodeError();

                    invalidStatusCodeError.resJSON = resJSON;
                    invalidStatusCodeError.res = res;

                    return reject(invalidStatusCodeError);
                }

                if (Request.isErrorResp(resJSON) && resJSON.error.error_code === 6 && this.repeatOnLimitError) {
                    log(`(${this.requestId}) request: 'Too many requests per second'. repeating`);
                    this.waitForNextRequest(this.boundRequest);
                    return;
                }

                resolve(resJSON);
            });
        }).on('error', (err: any) => {
            this.sdk.requestsInProgress--;

            err.res = {requestId: this.requestId};

            reject(err);
        });

        req.write(body);
        req.end();

        this.sdk.reqLastTime = Date.now();
    }

    private isRequestsLimitPassed() {
        return Date.now() - this.sdk.reqLastTime > Request.minRequestsInterval && this.sdk.requestsInProgress === 0;
    }

    private waitForNextRequest(cb: (...args: any[]) => any) {
        if (this.isRequestsLimitPassed()) {
            cb();
        } else {
            setTimeout(() => {
                this.waitForNextRequest(cb);
            }, 50);
        }
    }
}

export type VKResp<T> = VKGenericResponse<T> | VKSuccessfulResponse<T> | VKErrorResp;

export interface VKSuccessfulResponse<T> {
    response: T[];
}

export interface VKErrorResp {
    error: {
        error_code: number;
        error_msg: string;
        request_params?: VKRespParam[];
    };
}

export interface VKRespParam {
    key: string;
    value: string;
}
