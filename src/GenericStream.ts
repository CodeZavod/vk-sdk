
import {ReadableOptions} from 'stream';
import {Readable} from 'stronger-typed-streams';
import get = require('lodash.get');
import {Dictionary} from 'lodash';

import {VKSDK} from './VKSDK';

export default class GenericStream<
    TBody extends Dictionary<any>,
    TResponse,
    TOut
> extends Readable<TOut> {
    public requestInProgress = false;
    public offset = 0;
    public ended: boolean;
    public destroyed: boolean;

    private externalBuffer: TOut[] = [];
    private boundErrorHandler = this.errorHandler.bind(this);
    private boundSuccessHandler = this.successHandler.bind(this);

    constructor(
        opt: ReadableOptions,
        private sdk: VKSDK,
        public method: string,
        public body: TBody,
        private customSuccessHandler?: CustomSuccessHandler<TBody, TResponse, TOut>,
    ) {
        super(opt);

        this.offset = this.body.offset || 0;

        if (this.customSuccessHandler) {
            this.customSuccessHandler = this.customSuccessHandler.bind(this);
        }
    }

    public _read(size: number) {
        while (this.externalBuffer.length && !this.ended && !this.destroyed) {
            const chunk = this.externalBuffer.shift();

            if (chunk && !this.push(chunk)) {
                return;
            }
        }

        if (this.requestInProgress) {
            return;
        }

        this.requestInProgress = true;

        this.getItems(this.offset)
            .then(this.customSuccessHandler || this.boundSuccessHandler)
            .catch(this.boundErrorHandler);
    }

    public async getItems(offset: number) {
        const body = Object.assign({count: 10}, this.body, {offset}),
            result = await this.sdk[this.method](body);

        if (get(result, 'error')) {
            throw result;
        }

        return get(result, 'response');
    }

    public destroy(...args: any[]) {
        this.externalBuffer = [];
        super.destroy(...args);
    }

    private errorHandler(err: Error) {
        this.requestInProgress = false;
        console.error('error on fetch', err, this.method, this.offset, this.body);
        process.nextTick(() => this.emit('error', err));
    }

    private successHandler(response: VKResponse<any>) {
        this.requestInProgress = false;

        if (!response || !response.items || !response.items.length) {
            this.push(null);
            return;
        }

        this.offset += response.items.length;

        while (response.items.length && !this.ended && !this.destroyed) {
            const chunk = response.items.shift();

            if (chunk && !this.push(chunk)) {
                [].push.apply(this.externalBuffer, response.items);
                break;
            }
        }
    }
}

export interface VKResponse<T> extends VKGenericResponse<T> {
    profiles?: VKUserObject[];
    groups?: VKGroupObject[];
    videos?: VKVideoObject[];
}

export interface VKGenericResponse<T> {
    count: number;
    items: T[];
}

export interface VKUserCareer {
    group_id?: number | null;
    company?: string;
    country_id?: number | null;
    city_id?: number | null;
    city_name?: string;
    from?: number;
    until?: number;
    position?: string;
}

export interface VKUserObject {
    id: number;
    first_name: string;
    last_name: string;
    deactivated?: 'deleted' | 'banned';
    hidden?: 1;
    about?: string;
    activities?: string;
    bdate?: string;
    books?: string;
    career?: VKUserCareer[];
    city?: VKUserRegion;
    country?: VKUserRegion;
    domain?: string;
    followers_count?: number;
    games?: string;
    has_mobile?: 0 | 1;
    has_photo?: 0 | 1;
    home_town?: string;
    interests?: string;
    mobile_phone?: string;
    movies?: string;
    music?: string;
    nickname?: string;
    occupation?: {type: 'work' | 'school' | 'university', name: string, id: number};
    photo_50?: string;
    photo_100?: string;
    photo_200_orig?: string;
    photo_200?: string;
    photo_400_orig?: string;
    photo_id?: string;
    photo_max?: string;
    photo_max_orig?: string;
    screen_name?: string;
    sex?: 0 | 1 | 2;
    site?: string;
    status?: string;
    universities?: VKUniversityObject[];
    verified?: 0 | 1;
    wall_comments?: 0 | 1;
}

export interface VKPostGeoObject {
    type: string;
    coordinates: string;
    place?: {
        id: number;
        title: string;
        latitude: number;
        longitude: number;
        created: number;
        icon: string;
        country: string;
        city: string;
        type?: string;
        group_id?: number;
        group_photo?: string;
        checkins?: number;
        updated?: number;
        address?: number;
    };
}

export interface VKPostAttachmentObject {
    type: 'photo' | 'video';
    [properties: string]: any;
}

export interface VKPostObject {
    id: number;
    owner_id: number;
    from_id?: number;
    created_by: number;
    date: number;
    text: string;
    reply_owner_id?: number;
    reply_post_id?: number;
    friends_only?: 1;
    post_type: 'post' | 'copy' | 'reply' | 'postpone' | 'suggest';
    attachments?: VKPostAttachmentObject[];
    geo?: VKPostGeoObject;
    signer_id?: number;
    copy_history?: VKPostObject[];
    marked_as_ads?: 0 | 1;
}

export interface VKUserRegion {
    id: number;
    title: string;
}

export interface VKUniversityObject {
    id: number;
    country: number;
    city: number;
    name: string;
    faculty: number;
    faculty_name: string;
    chair: number;
    chair_name: string;
    graduation: number;
    education_form: string;
    education_status: string;
}

export interface VKGroupContactObject {
    user_id: number;
    desc?: string;
    phone?: string;
    email?: string;
}

export interface VKGroupObject {
    type: 'group' | 'page' | 'event';
    id: number;
    name: string;
    screen_name: string;
    is_closed: 0 | 1 | 2;
    deactivated?: 'deleted' | 'banned';
    status?: string;
    contacts?: VKGroupContactObject[];
    has_photo?: 0 | 1;
    photo_max_orig?: string;
    photo_50: string;
    photo_100: string;
    photo_200: string;
}

export interface VKVideoObject {
    id: number;
    owner_id: number;
    title: string;
    description: string;
    duration: number;
    photo_130?: string;
    photo_320?: string;
    photo_640?: string;
    photo_800?: string;
    date: number;
    adding_date: number;
    views: number;
    comments: number;
    player?: string;
    platform?: string;
    is_private?: 1;
    access_ley?: string;
    processing?: 1;
    live?: 1;
    upcoming?: 1;
}

export interface VKPhotoObject {
    id: number;
    album_id: number;
    owner_id: number;
    user_id?: number;
    text: string;
    date: number;
    photo_75?: string;
    photo_130?: string;
    photo_604?: string;
    photo_807?: string;
    photo_1280?: string;
    photo_2560?: string;
    width?: number;
    height?: number;
}



export type CustomSuccessHandler<U, T, TOut> = (
    this: GenericStream<U, T, TOut>,
    response: T,
) => void;
