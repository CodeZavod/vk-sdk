
import Request from './Request';
import Errors from './Errors';

export class VKSDK {
    public static Errors = Errors;
    public static userFields = [
        'has_photo', 'photo_max_orig', 'photo_id', 'nickname', 'domain', 'screen_name', 'status', 'sex', 'city',
        'country', 'bdate', 'has_mobile', 'contacts', 'occupation', 'career', 'universities',
    ];

    public reqLastTime: number = new Date(0).getTime();
    public requestingNow: boolean = false;

    private defaultOptions: any = {
        appSecret: '',
        appId: '',
        https: true,
        version: '5.68',
        language: 'ru',
        secure: true,
    };
    private options: any = {};
    private token: string = '';

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

    public getUsersByIds(userIds: number[], fields: string[] = [], nameCase: string = 'nom') {
        return this.request('users.get')
            .setBody({user_ids: userIds, fields: fields.join(','), name_case: nameCase}).send();
    }

    public getFriends(body: FriendsGetOptions = {}) {
        if (Array.isArray(body.fields)) {
            body.fields = body.fields.join(',');
        }

        return this.request('friends.get')
            .setBody(body).send();
    }

    public getFollowers(body: FollowersGetOptions = {}) {
        if (Array.isArray(body.fields)) {
            body.fields = body.fields.join(',');
        }

        return this.request('users.getFollowers')
            .setBody(body).send();
    }

    public getSubscriptions(body: SubscriptionsGetOptions = {}) {
        if (Array.isArray(body.fields)) {
            body.fields = body.fields.join(',');
        }

        return this.request('users.getSubscriptions')
            .setBody(body).send();
    }

    public getUsersSubscriptionsExtended(body: SubscriptionsGetOptions = {}) {
        return this.request('execute')
            .setBody({
                code: `
                    var subscriptions = API.users.getSubscriptions(),
                        users = API.users.get({
                            user_ids: subscriptions.users.items,
                            fields: ${JSON.stringify(body.fields || VKSDK.userFields)}
                        });

                    return {items: users};
                `,
            }).send();
    }

    public getWall(body: WallGetOptions = {}) {
        if (Array.isArray(body.fields)) {
            body.fields = body.fields.join(',');
        }

        return this.request('wall.get')
            .setBody(body).send();
    }

    public getWallExtended(body: WallGetOptions = {}) {
        return this.request('execute')
            .setBody({
                code: `
                    var posts = API.wall.get(${JSON.stringify(body)}),
                        postsAttachments = posts.items@.attachments,
                        videos_ids = [],
                        postAttachments,
                        attachments = [];

                    while (postAttachments = postsAttachments.shift()) {
                        var attachment;

                        while (attachment = postAttachments.shift()) {

                            if (attachment.type == "video") {
                                videos_ids.push(
                                    attachment.video.owner_id + "_" + attachment.video.id + "_" + 
                                    attachment.video.access_key,
                                );
                            }
                        }
                    }

                    var videos = API.video.get({videos: videos_ids, extended: 1});

                    posts.videos = videos.items;

                    return posts;
                `,
            }).send();
    }

    public getVideos(body: VideosGetOptions = {}) {
        return this.request('video.get')
            .setBody(body).send();
    }

    public getPhotos(body: PhotosGetOptions = {}) {
        return this.request('photos.getAll')
            .setBody(body).send();
    }

    public request(method: string) {
        return new Request(method, this);
    }
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
