# Important

This is unofficial repository. It has been written for internal use and do not fit common Open Source Project requirements.
You still can send PR or issue, but remember this.

# Installation

Install and save it to `package.json`:
```
npm i @codezavod/vk-sdk -S
```

# Usage

```javascript

const VKSDK = require('VKSDK'),
    sdk = new VKSDK({
        appId: 1234567,
        appSecret: 'xxx',
    });

sdk.setToken('xxx');
```

# Examples

#### Get photos list

```js
sdk.getPhotos({
    owner_id: 172761438,
    count: 3,
    extended: 1,
    no_service_albums: 0,
    skip_hidden: 0,
}).then((photos) => {});
```

<details>
 <summary>JSON answer</summary>

```json
{
  "response":{
    "count":2,
    "items":[
      {
        "id":456239033,
        "album_id":-7,
        "owner_id":172761438,
        "photo_75":"https://sun9-19.userapi.com/c840029/v840029074/37f80/wcb4jKn_yd4.jpg",
        "photo_130":"https://sun9-19.userapi.com/c840029/v840029074/37f81/oRpMC3mAJO8.jpg",
        "photo_604":"https://sun9-19.userapi.com/c840029/v840029074/37f82/RhHQf4iFdjU.jpg",
        "photo_807":"https://sun9-19.userapi.com/c840029/v840029074/37f83/DIEd_yTKNck.jpg",
        "photo_1280":"https://sun9-19.userapi.com/c840029/v840029074/37f84/CGvLsfyBv7M.jpg",
        "photo_2560":"https://sun9-19.userapi.com/c840029/v840029074/37f85/1z0q4YPU9i4.jpg",
        "width":1080,
        "height":1920,
        "text":"",
        "date":1507112802,
        "post_id":47,
        "likes":{
          "user_likes":0,
          "count":1
        },
        "reposts":{
          "count":0
        }
      },
      {
        "id":284050571,
        "album_id":-6,
        "owner_id":172761438,
        "photo_75":"https://pp.userapi.com/c411618/v411618438/42/cKKi_yw5ksI.jpg",
        "photo_130":"https://pp.userapi.com/c411618/v411618438/43/lg_Z346xQDg.jpg",
        "photo_604":"https://pp.userapi.com/c411618/v411618438/44/cX2sLZNGdBU.jpg",
        "photo_807":"https://pp.userapi.com/c411618/v411618438/45/U-h6gbueF2Q.jpg",
        "photo_1280":"https://pp.userapi.com/c411618/v411618438/46/biD5XTMhPzY.jpg",
        "photo_2560":"https://pp.userapi.com/c411618/v411618438/47/G09gxS_F69I.jpg",
        "width":900,
        "height":1279,
        "text":"",
        "date":1338497351,
        "post_id":2,
        "likes":{
          "user_likes":0,
          "count":2
        },
        "reposts":{
          "count":0
        }
      }
    ]
  }
}
```
</details>

#### Get videos list

```js
sdk.getVideos({
    owner_id: 172761438,
    fields: [
        'has_photo', 'photo_max_orig', 'photo_id', 'nickname', 'domain', 'screen_name', 'status', 'sex', 'city',
        'country', 'bdate', 'has_mobile', 'contacts', 'occupation', 'career', 'universities',
    ],
    count: 3,
    extended: 1,
}).then((videos) => {});
```

<details>
 <summary>JSON answer</summary>

```json
{  
  "response":{  
    "count":3,
    "items":[  
      {  
        "id":164067695,
        "owner_id":-22818163,
        "title":"Matryoshka - Monotonous Purgatory (MUSIC VIDEO) 2012.12.12 release",
        "duration":378,
        "description":"matryoshka - Laideronnette 2012.12.12 release\nBuy CD(pre oder) http://www.virgin-babylon-records.com/unsupermarket/music_022.html\nto click (CD) button under \"INTERNATIONAL\" or \"JAPAN\" to purchase.\nyou can buy CD with Paypal. \nレーベル通販特価 ¥2000 (定価¥2200)\n\nhttp://vk.com/wall-22818163_6108",
        "date":1355414938,
        "comments":0,
        "views":139,
        "photo_130":"https://pp.userapi.com/c6076/u31410966/video/s_4aa4198f.jpg",
        "photo_320":"https://pp.userapi.com/c6076/u31410966/video/l_7789eda9.jpg",
        "photo_800":"https://pp.userapi.com/c6076/u31410966/video/x_cc3f3476.jpg",
        "adding_date":1425131379,
        "user_id":31410966,
        "player":"https://www.youtube.com/embed/RaVu3IxxavA?__ref=vk.api",
        "platform":"YouTube",
        "can_add":0,
        "can_comment":1,
        "can_repost":1,
        "likes":{  
          "user_likes":0,
          "count":16
        },
        "reposts":{  
          "count":1,
          "user_reposted":0
        },
        "repeat":0
      },
      {  
        "id":169267030,
        "owner_id":172761438,
        "title":"Modeselektor - Evil Twin (feat. Otto von Schirach)",
        "duration":249,
        "description":"",
        "date":1406658484,
        "comments":0,
        "views":6,
        "photo_130":"https://pp.userapi.com/c525319/u7182717/video/s_aa14349b.jpg",
        "photo_320":"https://pp.userapi.com/c525319/u7182717/video/l_6efa05bb.jpg",
        "adding_date":1406658484,
        "player":"https://vk.com/video_ext.php?oid=172761438&id=169267030&hash=c2007f333f5baa5c&__ref=vk.api&api_hash=150712701656fe73159b7139df62_HE3TINJSHE4Q",
        "can_add":1,
        "can_comment":1,
        "can_repost":1,
        "likes":{  
          "user_likes":0,
          "count":2
        },
        "reposts":{  
          "count":0,
          "user_reposted":0
        },
        "repeat":0
      }
    ],
    "profiles":[  
      {  
        "id":31410966,
        "first_name":"Вадим",
        "last_name":"Томилов",
        "universities":[  
          {  
            "id":31037,
            "country":1,
            "city":0,
            "name":"МПИ ФСБ РФ (бывш. МВИ ФПС РФ)"
          }
        ]
      },
      {  
        "id":172761438,
        "first_name":"Pablo",
        "last_name":"Escobar",
        "universities":[]
      }
    ],
    "groups":[  
      {  
        "id":22818163,
        "name":"Trip-Hop News",
        "screen_name":"triphopnews",
        "is_closed":0,
        "type":"page",
        "photo_50":"https://pp.userapi.com/c302712/g22818163/e_141b4bf0.jpg",
        "photo_100":"https://pp.userapi.com/c302712/g22818163/d_ed27ce16.jpg",
        "photo_200":"https://pp.userapi.com/c302712/g22818163/d_ed27ce16.jpg"
      }
    ]
  }
}
```
</details>

#### Get posts list from wall

```js
sdk.getWallExtended({
    owner_id: 172761438,
    fields: [
        'has_photo', 'photo_max_orig', 'photo_id', 'nickname', 'domain', 'screen_name', 'status', 'sex', 'city',
        'country', 'bdate', 'has_mobile', 'contacts', 'occupation', 'career', 'universities',
    ],
    count: 3,
    extended: 1,
}).then((videos) => {});
```

<details>
 <summary>JSON answer</summary>

```json
{  
  "response":{  
    "count":1,
    "items":[  
      {  
        "id":47,
        "from_id":172761438,
        "owner_id":172761438,
        "date":1507112816,
        "post_type":"post",
        "text":"mmm, coffee...",
        "attachments":[  
          {  
            "type":"photo",
            "photo":{  
              "id":456239033,
              "album_id":-7,
              "owner_id":172761438,
              "photo_75":"https://sun9-19.userapi.com/c840029/v840029074/37f80/wcb4jKn_yd4.jpg",
              "photo_130":"https://sun9-19.userapi.com/c840029/v840029074/37f81/oRpMC3mAJO8.jpg",
              "photo_604":"https://sun9-19.userapi.com/c840029/v840029074/37f82/RhHQf4iFdjU.jpg",
              "photo_807":"https://sun9-19.userapi.com/c840029/v840029074/37f83/DIEd_yTKNck.jpg",
              "photo_1280":"https://sun9-19.userapi.com/c840029/v840029074/37f84/CGvLsfyBv7M.jpg",
              "photo_2560":"https://sun9-19.userapi.com/c840029/v840029074/37f85/1z0q4YPU9i4.jpg",
              "width":1080,
              "height":1920,
              "text":"",
              "date":1507112802,
              "post_id":47,
              "access_key":"46d38501a5e2173da3"
            }
          },
          {  
            "type":"video",
            "video":{  
              "id":169267030,
              "owner_id":172761438,
              "title":"Modeselektor - Evil Twin (feat. Otto von Schirach)",
              "duration":249,
              "description":"",
              "date":1406658484,
              "comments":0,
              "views":6,
              "photo_130":"https://pp.userapi.com/c525319/u7182717/video/s_aa14349b.jpg",
              "photo_320":"https://pp.userapi.com/c525319/u7182717/video/l_6efa05bb.jpg",
              "access_key":"626d9c14b06ade1af8",
              "can_add":1
            }
          }
        ],
        "geo":{  
          "type":"point",
          "coordinates":"55.7798847286 49.129545842014",
          "place":{  
            "id":0,
            "title":"улица Хади Такташа, Казань",
            "latitude":0,
            "longitude":0,
            "created":0,
            "icon":"https://vk.com/images/places/place.png",
            "country":"Россия",
            "city":"Казань"
          },
          "showmap":1
        },
        "post_source":{  
          "type":"vk"
        },
        "comments":{  
          "count":0,
          "groups_can_post":true,
          "can_post":1
        },
        "likes":{  
          "count":1,
          "user_likes":0,
          "can_like":1,
          "can_publish":1
        },
        "reposts":{  
          "count":0,
          "user_reposted":0
        },
        "views":{  
          "count":10
        }
      }
    ],
    "profiles":[  
      {  
        "id":172761438,
        "first_name":"Pablo",
        "last_name":"Escobar",
        "sex":2,
        "nickname":"",
        "domain":"id172761438",
        "screen_name":"id172761438",
        "photo_max_orig":"https://pp.userapi.com/c411618/u172761438/a_94c39a72.jpg",
        "photo_id":"172761438_284050571",
        "has_photo":1,
        "has_mobile":1,
        "mobile_phone":"",
        "home_phone":"",
        "status":"азаза",
        "career":[],
        "universities":[]
      }
    ],
    "groups":[],
    "videos":[  
      {  
        "id":169267030,
        "owner_id":172761438,
        "title":"Modeselektor - Evil Twin (feat. Otto von Schirach)",
        "duration":249,
        "description":"",
        "date":1406658484,
        "comments":0,
        "views":6,
        "photo_130":"https://pp.userapi.com/c525319/u7182717/video/s_aa14349b.jpg",
        "photo_320":"https://pp.userapi.com/c525319/u7182717/video/l_6efa05bb.jpg",
        "player":"https://vk.com/video_ext.php?oid=172761438&id=169267030&hash=c2007f333f5baa5c&__ref=vk.api&api_hash=1507127177a60d594b09fdd5cf78_HE3TINJSHE4Q",
        "can_add":1,
        "can_comment":1,
        "can_repost":1,
        "likes":{  
          "user_likes":0,
          "count":2
        },
        "reposts":{  
          "count":0,
          "user_reposted":0
        },
        "repeat":0
      }
    ]
  }
}
```
</details>

#### Get subscribers list

```js
sdk.getUsersSubscriptionsExtended().then((subscriptions) => {});
```

<details>
 <summary>JSON answer</summary>

```json
{  
  "response":{  
    "items":[  
      {  
        "id":100180432,
        "first_name":"Аделя",
        "last_name":"Зарипова",
        "sex":1,
        "nickname":"",
        "domain":"zaripova_adelya",
        "screen_name":"zaripova_adelya",
        "bdate":"18.8.1996",
        "city":{  
          "id":60,
          "title":"Казань"
        },
        "country":{  
          "id":1,
          "title":"Россия"
        },
        "photo_max_orig":"https://sun9-19.userapi.com/c639322/v639322301/4f720/3fe1J82zEAc.jpg",
        "photo_id":"100180432_456242347",
        "has_photo":1,
        "has_mobile":1,
        "mobile_phone":"",
        "home_phone":"",
        "status":"🐱",
        "occupation":{  
          "type":"work",
          "id":32127188,
          "name":"LOOK OF YOUNG"
        }
      }
    ]
  }
}
```
</details>

#### Get followers list

```js
sdk.getFollowers({
    fields: [
        'has_photo', 'photo_max_orig', 'photo_id', 'nickname', 'domain', 'screen_name', 'status', 'sex', 'city',
        'country', 'bdate', 'has_mobile', 'contacts', 'occupation', 'career', 'universities',
    ],
    count: 10,
}).then((followers) => {});
```

<details>
 <summary>JSON answer</summary>

```json
{  
  "response":{  
    "count":125,
    "items":[  
      {  
        "id":277708635,
        "first_name":"Софья",
        "last_name":"Иванова",
        "deactivated":"banned",
        "has_photo":0,
        "photo_max_orig":"https://vk.com/images/deactivated_400.png",
        "domain":"id277708635",
        "sex":1
      },
      {  
        "id":442684624,
        "first_name":"Стас",
        "last_name":"Станиславский",
        "sex":2,
        "nickname":"",
        "domain":"id442684624",
        "screen_name":"id442684624",
        "city":{  
          "id":60,
          "title":"Казань"
        },
        "country":{  
          "id":1,
          "title":"Россия"
        },
        "photo_max_orig":"https://sun9-19.userapi.com/c639918/v639918025/44b6b/kPIDgqY_h3k.jpg",
        "photo_id":"442684624_456239101",
        "has_photo":1,
        "has_mobile":1,
        "mobile_phone":"",
        "home_phone":"",
        "status":"Делаю татуировки.",
        "occupation":{  
          "type":"university",
          "id":520,
          "name":"КГАВМ им. Баумана"
        },
        "career":[],
        "universities":[  
          {  
            "id":520,
            "country":1,
            "city":60,
            "name":"КГАВМ им. Баумана"
          }
        ]
      }
    ]
  }
}
```
</details>

#### Get friends list

```js
sdk.getFriends({
    fields: [
        'has_photo', 'photo_max_orig', 'photo_id', 'nickname', 'domain', 'screen_name', 'status', 'sex', 'city',
        'country', 'bdate', 'has_mobile', 'contacts', 'occupation', 'career', 'universities',
    ],
    count: 10,
}).then((friends) => {});
```

<details>
 <summary>JSON answer</summary>

```json
{
  "response":{
    "count":185,
    "items":[
      {  
        "id":1536852,
        "first_name":"Алина",
        "last_name":"Николаева",
        "sex":1,
        "nickname":"",
        "domain":"alinik",
        "screen_name":"alinik",
        "bdate":"9.8.1993",
        "city":{  
          "id":1,
          "title":"Москва"
        },
        "country":{  
          "id":1,
          "title":"Россия"
        },
        "photo_max_orig":"https://pp.userapi.com/c639226/v639226514/3adb3/vuvWiOPKyJs.jpg",
        "photo_id":"1536852_456241213",
        "has_photo":1,
        "has_mobile":1,
        "mobile_phone":"123",
        "home_phone":"",
        "status":"ведь пока жив последний из нас - мир ещё устоит",
        "occupation":{  
          "type":"university",
          "id":289,
          "name":"МПГУ (бывш. МГПИ им. Ленина) (до 2015)"
        },
        "career":[  
          {  
            "company":"Учебная часть",
            "country_id":1,
            "city_id":1,
            "from":2011,
            "until":2014,
            "position":"Секретарь"
          },
          {  
            "company":"Фонд \"Наше будущее\"",
            "country_id":1,
            "city_id":1,
            "from":2015,
            "until":2017
          }
        ],
        "universities":[  
          {  
            "id":289,
            "country":1,
            "city":1,
            "name":"МПГУ (бывш. МГПИ им. Ленина)",
            "faculty":2414,
            "faculty_name":"Иностранных языков (Институт филологии и иностранных языков)",
            "chair":51561,
            "chair_name":"Английского языка"
          },
          {  
            "id":212,
            "country":1,
            "city":1,
            "name":"МГУТУ им. К. Г. Разумовского (ПКУ) (бывш. МГТА, ВЗИПП)",
            "faculty":49488,
            "faculty_name":"Институт системной автоматизации и инноватики",
            "chair":1765692,
            "chair_name":"Высшей математики и физики",
            "education_form":"Очное отделение"
          }
        ],
        "online":0
      }
    ]
  }
}
```
</details>

#### Get user info

```js
sdk.getUsersByIds([9745299], [
    'has_photo', 'photo_max_orig', 'photo_id', 'nickname', 'domain', 'screen_name', 'status', 'sex', 'city',
    'country', 'bdate', 'has_mobile', 'contacts', 'occupation', 'career', 'universities',
]).then((user) => {});
```

<details>
 <summary>JSON answer</summary>

```json
{  
  "response":[  
    {  
      "id":9745299,
      "first_name":"Вадим",
      "last_name":"Петров",
      "sex":2,
      "nickname":"imposibrus",
      "domain":"imposibrus",
      "screen_name":"imposibrus",
      "bdate":"20.2.1991",
      "city":{  
        "id":60,
        "title":"Казань"
      },
      "country":{  
        "id":1,
        "title":"Россия"
      },
      "photo_max_orig":"https://pp.userapi.com/c636930/v636930299/236b4/DWPHV2M_3iA.jpg",
      "photo_id":"9745299_434433568",
      "has_photo":1,
      "has_mobile":1,
      "mobile_phone":"123",
      "home_phone":"",
      "status":"Отныне и впредь прошу НЕ величать меня как \"Гражданин города Иннополис\" (типа переехал обратно 😄)",
      "occupation":{  
        "type":"work",
        "id":37617734,
        "name":"Fantasy Technology™"
      },
      "career":[  
        {  
          "company":"Улет-студия",
          "country_id":1,
          "city_id":60,
          "from":2007,
          "until":2007,
          "position":"Стажер"
        },
        {  
          "company":"Улет-студия",
          "country_id":1,
          "city_id":60,
          "from":2009,
          "until":2010,
          "position":"Верстальщик-Продвиженец"
        },
        {  
          "company":"Служба Компьютерного Сервиса \"Установщик\"",
          "country_id":1,
          "city_id":60,
          "from":2009,
          "until":2010,
          "position":"Специалист широко профиля"
        },
        {  
          "group_id":37617734,
          "country_id":1,
          "city_id":60,
          "from":2012,
          "until":2016
        },
        {  
          "group_id":11283947,
          "country_id":1,
          "city_id":5470540,
          "from":2016,
          "until":2017,
          "position":"Разработчик интерфейсов"
        },
        {  
          "group_id":37617734,
          "country_id":1,
          "city_id":60,
          "from":2017,
          "position":"Делаю чтоб работало"
        }
      ],
      "universities":[  
        {  
          "id":525,
          "country":1,
          "city":60,
          "name":"КГТУ-КАИ им. Туполева",
          "faculty":2747,
          "faculty_name":"Институт компьютерных технологий и защиты информации",
          "chair":2044647,
          "chair_name":"Компьютерных систем",
          "graduation":2013,
          "education_form":"Очное отделение",
          "education_status":"Студент (специалист)"
        }
      ]
    }
  ]
}
```
</details>
