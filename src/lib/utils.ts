import { AuthorData } from "../interfaces/ResultTypes";

export const createApiContext = (ytcfg: any) => {
    return {
        context: {
            capabilities: {},
            client: {
                clientName: ytcfg.INNERTUBE_CLIENT_NAME,
                clientVersion: ytcfg.INNERTUBE_CLIENT_VERSION,
                experimentIds: [],
                experimentsToken: "",
                gl: ytcfg.GL,
                hl: ytcfg.HL,
                locationInfo: {
                    locationPermissionAuthorizationStatus: "LOCATION_PERMISSION_AUTHORIZATION_STATUS_UNSUPPORTED",
                },
                musicAppInfo: {
                    musicActivityMasterSwitch: "MUSIC_ACTIVITY_MASTER_SWITCH_INDETERMINATE",
                    musicLocationMasterSwitch: "MUSIC_LOCATION_MASTER_SWITCH_INDETERMINATE",
                    pwaInstallabilityStatus: "PWA_INSTALLABILITY_STATUS_UNKNOWN",
                },
                utcOffsetMinutes: -new Date().getTimezoneOffset(),
            },
            request: {
                internalExperimentFlags: [{
                        key: "force_music_enable_outertube_tastebuilder_browse",
                        value: "true",
                    },
                    {
                        key: "force_music_enable_outertube_playlist_detail_browse",
                        value: "true",
                    },
                    {
                        key: "force_music_enable_outertube_search_suggestions",
                        value: "true",
                    },
                ],
                sessionIndex: {},
            },
            user: {
                enableSafetyMode: false,
            },
        }
    };
};

export const getCategoryURI = (categoryName?: string): string | null => {
    let b64Key = '';
    switch (categoryName?.toUpperCase()) {
        case 'SONG':
            b64Key = 'RAAGAAgACgA';
            break;
        case 'VIDEO':;
            b64Key = 'BABGAAgACgA';
            break;
        case 'ALBUM':
            b64Key = 'BAAGAEgACgA';
            break;
        case 'ARTIST':
            b64Key = 'BAAGAAgASgA';
            break;
        case 'PLAYLIST':
            b64Key = 'BAAGAAgACgB';
            break;
    }

    if (b64Key.length > 0) {
        return `Eg-KAQwIA${b64Key}MABqChAEEAMQCRAFEAo%3D`;
    } else {
        return null;
    }
};

export const fv = (input: object, query: string, justOne = false): any => {
    const iterate: any = (x: any, y: string) => {
        var r = [];

        x?.hasOwnProperty(y) && r.push(x[y]);
        if (justOne && x.hasOwnProperty(y)) {
            return r.shift();
        }

        if (Array.isArray(x)) {
            for (let i = 0; i < x.length; i++) {
                r = r.concat(iterate(x[i], y));
            }
        } else if (typeof x === 'object') {
            const c = Object.keys(x);
            if (c.length > 0) {
                for (let i = 0; i < c.length; i++) {
                    r = r.concat(iterate(x[c[i]], y));
                }
            }
        }
        return r.length == 1 ? r.shift() : r;
    };

    let d = query.split(':'),
        v = input;
    for (let i = 0; i < d.length; i++) {
        v = iterate(v, d[i]);
    }
    return v;
};

export const splitArray = (arr: any[], sprtr: (element: any) => boolean): any[] => {
    let h: any[] = [], 
        newArr: any[] = [];
    
    arr.forEach(element => {
        if (sprtr(element)) {
            h.push(newArr);
            newArr = [];
        } else {
            newArr.push(element);
        }
    });

    if (newArr.length !== 0) {
        h.push(newArr);
    }

    return h;
}
;
export const hms2s = (v: string): number => {
    try {
        let p = v.split(':'),
            s = 0,
            f = 1;
        while (p.length > 0) {
            s += f * parseInt(p.pop()!, 10);
            f *= 60;
        }
        return s;
    } catch (e) {
        return 0;
    }
};

export const toAuthorData = (data: any, album?: boolean): AuthorData => {
    const serialize = (x: any): AuthorData => {
        return {
            name: x.text,
            browseId: x.navigationEndpoint?.browseEndpoint?.browseId
        };
    };

    let a = data[album ? 2 : 1].filter((e: never, i: number) => i % 2 === 0).map((x: any) => serialize(x));
    return a.length == 1 ? a[0] : a;
};