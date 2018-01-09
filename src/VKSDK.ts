
import omit = require('lodash.omit');
import {Request, VKErrorResp, VKRespParam, VKSuccessfulResponse} from './Request';
import Errors from './Errors';
import GenericStream, {
    CustomSuccessHandler, VKGenericResponse, VKGroupObject, VKPhotoObject, VKPostObject, VKResponse, VKUserObject,
    VKUserRegion,
    VKVideoObject,
} from './GenericStream';

export class VKSDK {
    public static Errors = Errors;
    public static userFields = [
        'has_photo', 'photo_max_orig', 'photo_id', 'nickname', 'domain', 'screen_name', 'status', 'sex', 'city',
        'country', 'bdate', 'has_mobile', 'contacts', 'occupation', 'career', 'universities',
    ];
    public static groupFields = [
        'name', 'screen_name', 'is_closed', 'type', 'photo_200',
    ];

    public static getFullResponseObj<TBody, TResponse, TOut>(
        this: GenericStream<TBody, TResponse & VKGenericResponse<any>, TResponse>,
        response: TResponse & VKGenericResponse<any>,
    ) {
        this.requestInProgress = false;

        if (!response || !response.items || !response.items.length) {
            this.push(null);
            return;
        }

        if (!this.ended && !this.destroyed) {
            this.offset += response.items.length;

            this.push(response);
        }
    }

    public reqLastTime: number = new Date(0).getTime();
    public requestingNow: boolean = false;
    public options: any = {};
    public token: string = '';

    private defaultOptions: any = {
        appSecret: '',
        appId: '',
        https: true,
        version: '5.68',
        language: 'ru',
        secure: true,
    };

    constructor(options: object) {
        this.options = Object.assign({}, this.defaultOptions, options);
    }

    public setAppSecret(appSecret: string) {
        this.options.appSecret = appSecret;

        return this;
    }

    public setAppId(appId: string) {
        this.options.appId = appId;

        return this;
    }

    public setHttps(https: boolean) {
        this.options.https = https;

        return this;
    }

    public setVersion(version: string) {
        this.options.version = version;

        return this;
    }

    public setLanguage(language: string) {
        this.options.language = language;

        return this;
    }

    public setSecure(secure: boolean) {
        this.options.secure = secure;

        return this;
    }

    public setToken(token: string) {
        this.token = token;

        return this;
    }

    public getAppSecret() {
        return this.options.appSecret;
    }

    public getAppId() {
        return this.options.appId;
    }

    public getHttps() {
        return this.options.https;
    }

    public getVersion() {
        return this.options.version;
    }

    public getLanguage() {
        return this.options.language;
    }

    public getSecure() {
        return this.options.secure;
    }

    public getToken() {
        return this.token;
    }

    public getUsersByIds(userIds: number[] | string[], fields: string[] = [], nameCase: string = 'nom') {
        return this.request<VKUserObject>('users.get')
            .setBody({user_ids: userIds, fields: fields.join(','), name_case: nameCase}).send();
    }

    public getFriends(body: FriendsGetOptions = {}) {
        if (Array.isArray(body.fields)) {
            body.fields = body.fields.join(',');
        }

        return this.request<VKUserObject>('friends.get')
            .setBody(body).send();
    }

    public getFollowers(body: FollowersGetOptions = {}) {
        if (Array.isArray(body.fields)) {
            body.fields = body.fields.join(',');
        }

        return this.request<VKUserObject>('users.getFollowers')
            .setBody(body).send();
    }

    public getSubscriptions(body: SubscriptionsGetOptions = {}) {
        if (Array.isArray(body.fields)) {
            body.fields = body.fields.join(',');
        }

        return this.request<SubscriptionObject>('users.getSubscriptions')
            .setBody(body).send();
    }

    public getUsersSubscriptionsExtended(body: SubscriptionsExtendedGetOptions = {}) {
        return this.request<VKResponse<SubscriptionObject>>('execute')
            .setBody({
                code: `
                    var subscriptions = API.users.getSubscriptions(),
                        users = API.users.get({
                            user_ids: subscriptions.users.items,
                            fields: ${JSON.stringify(body.userFields || VKSDK.userFields)}
                        }),
                        groups = API.groups.getById({
                            group_ids: subscriptions.groups.items,
                            fields: ${JSON.stringify(body.groupFields || VKSDK.groupFields)}
                        });

                    return {users: users, groups: groups};
                `,
            }).send();
    }

    public getWall(body: WallGetOptions = {}) {
        if (Array.isArray(body.fields)) {
            body.fields = body.fields.join(',');
        }

        return this.request<VKPostObject>('wall.get')
            .setBody(body).send();
    }

    public getWallExtended(body: WallGetOptions = {}) {
        return this.request<VKResponse<VKPostObject>>('execute')
            .setBody({
                code: `
                    var posts = API.wall.get(${JSON.stringify(body)}),
                        postsAttachments = posts.items@.attachments,
                        videos_ids = [],
                        postAttachments,
                        attachments = [],
                        i = 0;

                    while (i < posts.items.length) {
                        var post = posts.items[i],
                            j = 0;

                        while (j < post.attachments.length) {
                            var attachment = post.attachments[j];

                            if (attachment.type == "video") {
                                videos_ids.push(
                                    attachment.video.owner_id + "_" + attachment.video.id + "_" + 
                                    attachment.video.access_key
                                );
                            }

                            j = j + 1;
                        }

                        i = i + 1;
                    }

                    if (videos_ids.length) {
                        var videos = API.video.get({videos: videos_ids, extended: 1});

                        posts.videos = videos.items;
                    }

                    return posts;
                `,
            }).send();
    }

    public getUserPhotosExtended(body: PhotosVideosExtendedGetOptions) {
        return this.request<VKResponse<VKPhotoObject>>('execute')
            .setBody({
                code: `
                    var posts = API.photos.getAll(${JSON.stringify(omit(body, ['fields']) || {})}),
                        owners = API.users.get({
                            user_ids: posts.items@.owner_id, 
                            fields: ${JSON.stringify(body.fields || VKSDK.userFields)}
                        }),
                        users = API.users.get({
                            user_ids: posts.items@.user_id,
                            fields: ${JSON.stringify(body.fields || VKSDK.userFields)}
                        });

                    posts.profiles = owners + users;

                    return posts;
                `,
            }).send();
    }

    public getUserVideosExtended(body: PhotosVideosExtendedGetOptions) {
        return this.request<VKResponse<VKVideoObject>>('execute')
            .setBody({
                code: `
                    var posts = API.video.get(${JSON.stringify(omit(body, ['fields']) || {})}),
                        owners = API.users.get({
                            user_ids: posts.items@.owner_id, 
                            fields: ${JSON.stringify(body.fields || VKSDK.userFields)}
                        });

                    posts.profiles = owners;

                    return posts;
                `,
            }).send();
    }

    public getPostLikesExtended(body: PhotosLikesExtendedGetOptions) {
        return this.request<VKResponse<number>>('execute')
            .setBody({
                code: `
                    var likes = API.likes.getList(${JSON.stringify(omit(body, ['userFields', 'groupFields']) || {})}),
                        usersIds = [],
                        groupsIds = [],
                        i = 0,
                        users = [],
                        groups = [];

                    while (i < likes.items.length) {
                        var id = likes.items[i];

                        if (id < 0) {
                            groupsIds.push(id * -1);
                        } else {
                            usersIds.push(id);
                        }

                        i = i + 1;
                    }

                    if (usersIds.length) {
                        users = API.users.get({
                            user_ids: usersIds,
                            fields: ${JSON.stringify(body.userFields || VKSDK.userFields)}
                        });
                    }
                    if (groupsIds) {
                        groups = API.groups.getById({
                            group_ids: groupsIds,
                            fields: ${JSON.stringify(body.groupFields || VKSDK.groupFields)}
                        });
                    }

                    likes.profiles = users;
                    likes.groups = groups;

                    return likes;
                `,
            }).send();
    }

    public getVideos(body: VideosGetOptions = {}) {
        return this.request<VKVideoObject>('video.get')
            .setBody(body).send();
    }

    public getPhotos(body: PhotosGetOptions = {}) {
        return this.request<VKPhotoObject>('photos.getAll')
            .setBody(body).send();
    }

    public getCitiesById(citiesIds: number|number[]) {
        if (!Array.isArray(citiesIds)) {
            citiesIds = [citiesIds];
        }

        return this.request<VKUserRegion>('database.getCitiesById')
            .setBody({
                city_ids: citiesIds.join(','),
            }).send();
    }

    public getCountriesById(countriesIds: number|number[]) {
        if (!Array.isArray(countriesIds)) {
            countriesIds = [countriesIds];
        }

        return this.request<VKUserRegion>('database.getCountriesById')
            .setBody({
                country_ids: countriesIds.join(','),
            }).send();
    }

    public getGroupsById(groupsIds: number|number[]) {
        if (!Array.isArray(groupsIds)) {
            groupsIds = [groupsIds];
        }

        return this.request<VKGroupObject>('groups.getById')
            .setBody({
                group_ids: groupsIds.join(','),
            }).send();
    }

    public makeStream<TBody, TResponse, TOut>(
        method: string,
        body: TBody,
        customSuccessHandler?: CustomSuccessHandler<TBody, TResponse, TOut>,
    ) {
        return new GenericStream<TBody, TResponse, TOut>(
            {objectMode: true, highWaterMark: 1},
            this,
            method,
            body,
            customSuccessHandler,
        );
    }

    public makeWallExtendedSteam(body: WallGetOptions = {}) {
        return this.makeStream<WallGetOptions, VKResponse<VKPostObject>, VKResponse<VKPostObject>>(
            'getWallExtended',
            body,
            VKSDK.getFullResponseObj,
        );
    }

    public makeUserVideosExtendedSteam(body: PhotosVideosExtendedGetOptions = {}) {
        return this.makeStream<PhotosVideosExtendedGetOptions, VKResponse<VKVideoObject>, VKResponse<VKVideoObject>>(
            'getUserVideosExtended',
            body,
            VKSDK.getFullResponseObj,
        );
    }

    public makeSubscriptionsSteam(body: SubscriptionsGetOptions = {}) {
        return this.makeStream<SubscriptionsGetOptions, VKResponse<SubscriptionObject>, SubscriptionObject>(
            'getSubscriptions',
            body,
        );
    }

    public makeFollowersSteam(body: FollowersGetOptions = {}) {
        return this.makeStream<FollowersGetOptions, VKResponse<VKUserObject>, VKUserObject>(
            'getFollowers',
            body,
        );
    }

    public makeFriendsSteam(body: FriendsGetOptions = {}) {
        return this.makeStream<FriendsGetOptions, VKResponse<VKUserObject>, VKUserObject>(
            'getFriends',
            body,
        );
    }

    public makePostLikesExtendedSteam(body: PhotosLikesExtendedGetOptions) {
        return this.makeStream<
            PhotosLikesExtendedGetOptions,
            VKResponse<number>,
            VKResponse<number>
        >(
            'getPostLikesExtended',
            body,
            VKSDK.getFullResponseObj,
        );
    }

    public makeUserPhotosExtendedSteam(body: PhotosVideosExtendedGetOptions) {
        return this.makeStream<
            PhotosVideosExtendedGetOptions,
            VKResponse<VKPhotoObject>,
            VKResponse<VKPhotoObject>
        >(
            'getUserPhotosExtended',
            body,
            VKSDK.getFullResponseObj,
        );
    }

    public request<TBody>(method: string) {
        return new Request<TBody>(method, this);
    }
}

export type SubscriptionObject = SubscriptionUser | VKGroupObject;

export interface SubscriptionUser extends VKUserObject {
    type: 'profile';
}

export interface GenericExtendableOptions {
    extended?: 1 | 0;
}
export interface GenericOptionsWithFields {
    fields?: string[]|string;
}
export interface GenericGetOptions {
    offset?: number;
    count?: number;
}
export interface GenericUserGetOptions extends GenericGetOptions, GenericOptionsWithFields {
    user_id?: number;
    name_case?: string;
}
export interface FriendsGetOptions extends GenericUserGetOptions {
    order?: string;
    list_id?: number;
}
export interface FollowersGetOptions extends GenericUserGetOptions {}
export interface SubscriptionsGetOptions extends GenericGetOptions, GenericOptionsWithFields, GenericExtendableOptions {
    user_id?: number;
}
export interface SubscriptionsExtendedGetOptions extends GenericGetOptions, GenericExtendableOptions {
    user_id?: number;
    userFields?: string[]|string;
    groupFields?: string[]|string;
}
export interface WallGetOptions extends GenericGetOptions, GenericOptionsWithFields, GenericExtendableOptions {
    owner_id?: number;
    domain?: string;
    filter?: 'suggests' | 'postponed' | 'owner' | 'others' | 'all';
}
export interface VideosGetOptions extends GenericGetOptions, GenericExtendableOptions {
    owner_id?: number;
    videos?: string;
    album_id?: number;
}
export interface PhotosGetOptions extends GenericGetOptions, GenericExtendableOptions {
    owner_id?: number;
    photo_sizes?: 1 | 0;
    no_service_albums?: 1 | 0;
    need_hidden?: 1 | 0;
    skip_hidden?: 1 | 0;
}

export interface PhotosVideosExtendedGetOptions extends PhotosGetOptions, GenericOptionsWithFields {}

export interface PhotosLikesExtendedGetOptions extends GenericGetOptions, GenericExtendableOptions {
    type: 'post' | 'comment' | 'photo' | 'audio' | 'video' | 'note' | 'market' | 'photo_comment' | 'video_comment' |
        'topic_comment' | 'market_comment' | 'sitepage';
    owner_id: number;
    item_id?: number;
    page_url?: string;
    filter?: 'likes' | 'copies';
    friends_only?: 0 | 1;
    skip_own?: 0 | 1;
    userFields?: string[] | string;
    groupFields?: string[] | string;
}

export {
    VKResponse, VKUserCareer, VKUserObject, VKPostGeoObject, VKPostAttachmentObject, VKPostObject, VKUserRegion,
    VKUniversityObject, VKGroupContactObject, VKGroupObject, VKVideoObject, VKPhotoObject,
} from './GenericStream';

export {VKResp, VKSuccessfulResponse, VKErrorResp, VKRespParam} from './Request';
