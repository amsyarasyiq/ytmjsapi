
const tough = require('tough-cookie')

// const utils = require('./utils')
// const parsers = require('./parsers')

import { AxiosInstance, AxiosRequestConfig, default as axios } from "axios";
import * as qs from "querystring";
import { createApiContext, getCategoryURI } from "./lib/utils";
import * as parsers from "./lib/parseSearchResult"
import { AlbumInfo, ArtistInfo, GeneralInfo, PlaylistInfo, SongInfo, VideoInfo } from "./interfaces/ResultTypes";
import { InfoTypes } from "./interfaces/InfoTypes";

axios.defaults.adapter = require('axios/lib/adapters/http');

export default class YoutubeMusicApi {
    
    // fields
    client:AxiosInstance;
    cookies:any;
    ytcfg:any;

    constructor() {
        this.ytcfg = {}
        this.cookies = new tough.CookieJar()

        this.client = axios.create({
            baseURL: 'https://music.youtube.com/',
            headers: {
                'User-Agent': 
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) \
                AppleWebKit/537.36 (KHTML, like Gecko) \
                Chrome/81.0.4044.129 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.5',
            },
            withCredentials: true
        });

        this.client.interceptors.request.use((req: AxiosRequestConfig<any> | any) => {
            const cookies = this.cookies.getCookieStringSync(req!.baseURL)
            if (cookies && cookies.length > 0) {
                req.headers['Cookie'] = cookies;
            }
            return req;
        }, (err: Error) => {
            return Promise.reject(err)
        });

        this.client.interceptors.response.use((res: any) => {
            if (res.headers.hasOwnProperty('set-cookie')) {
                if (Array.isArray(res.headers['set-cookie'])) {
                    res.headers['set-cookie'].map(value => {
                        this.cookies.setCookieSync(tough.Cookie.parse(value), res.config.baseURL)
                    })
                } else {
                    this.cookies.setCookieSync(tough.Cookie.parse(res.headers['set-cookie']), res.config.baseURL)
                }
            }
            return res
        })
    }
    
    static async create(cookie?: any): Promise<YoutubeMusicApi> {
        let api = new YoutubeMusicApi();
        return new Promise(async (resolve, reject) => {
            let client = await api.client.get('/', { headers: { 'Cookie': cookie ?? '' } });
            try {
                const js = client.data.match(/ytcfg\.set\((.*)\);/)[1];
                api.ytcfg = JSON.parse(js);
                if (api.ytcfg.LOGGED_IN) {
                    cookie.split('; ').forEach((c: any) => {
                        api.cookies.setCookieSync(tough.Cookie.parse(c), api.client.defaults.baseURL);
                    });
                }
                resolve(api);
            } catch (err) {
                reject(err);
            }
        });
    }

    private createApiRequest(endpointName: string, inputVariables: {}, inputQuery = {}) {
        const headers: any = Object.assign({
            'x-origin': this.client.defaults.baseURL,
            'X-Goog-Visitor-Id': this.ytcfg.VISITOR_DATA || '',
            'X-YouTube-Client-Name': this.ytcfg.INNERTUBE_CONTEXT_CLIENT_NAME,
            'X-YouTube-Client-Version': this.ytcfg.INNERTUBE_CLIENT_VERSION,
            'X-YouTube-Device': this.ytcfg.DEVICE,
            'X-YouTube-Page-CL': this.ytcfg.PAGE_CL,
            'X-YouTube-Page-Label': this.ytcfg.PAGE_BUILD_LABEL,
            'X-YouTube-Utc-Offset': String(-new Date().getTimezoneOffset()),
            'X-YouTube-Time-Zone': new Intl.DateTimeFormat().resolvedOptions().timeZone
        }, this.client.defaults.headers)

        return new Promise(async (resolve, reject) => {
            let input = qs.stringify(Object.assign({
                alt:'json',
                key:this.ytcfg.INNERTUBE_API_KEY
            }, inputQuery));

            let result = await this.client.post(
                `youtubei/${this.ytcfg.INNERTUBE_API_VERSION}/${endpointName}?${input}`, 
                Object.assign(inputVariables, createApiContext(this.ytcfg)), {
                    responseType: 'json',
                    headers: headers
                }
            );

                if (result.data.hasOwnProperty('responseContext')) {
                    resolve(result.data)
                }
                    
        });
    }

    async search(query: string, categoryName?: string): Promise<GeneralInfo[]> {
        let requestResult = await this.createApiRequest('search', {
            query: query,
            params: getCategoryURI(categoryName)
        });

        return parsers.parseSearchResult(requestResult, categoryName?.toLowerCase() as InfoTypes);
    }

    async searchSong(query: string): Promise<SongInfo[]> {
        return this.search(query, InfoTypes.Song) as Promise<SongInfo[]>;
    }

    async searchVideo(query: string): Promise<VideoInfo[]> {
        return this.search(query, InfoTypes.Video) as Promise<VideoInfo[]>;
    }

    async searchAlbum(query: string): Promise<AlbumInfo[]> {
        return this.search(query, InfoTypes.Album) as Promise<AlbumInfo[]>;
    }

    async searchArtist(query: string): Promise<ArtistInfo[]> {
        return this.search(query, InfoTypes.Artist) as Promise<ArtistInfo[]>;
    }

    async searchPlaylist(query: string): Promise<PlaylistInfo[]> {
        return this.search(query, InfoTypes.Playlist) as Promise<PlaylistInfo[]>;
    }
}