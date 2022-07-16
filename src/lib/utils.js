"use strict";
exports.__esModule = true;
exports.toAuthorData = exports.hms2s = exports.splitArray = exports.fv = exports.getCategoryURI = exports.createApiContext = void 0;
var createApiContext = function (ytcfg) {
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
                    locationPermissionAuthorizationStatus: "LOCATION_PERMISSION_AUTHORIZATION_STATUS_UNSUPPORTED"
                },
                musicAppInfo: {
                    musicActivityMasterSwitch: "MUSIC_ACTIVITY_MASTER_SWITCH_INDETERMINATE",
                    musicLocationMasterSwitch: "MUSIC_LOCATION_MASTER_SWITCH_INDETERMINATE",
                    pwaInstallabilityStatus: "PWA_INSTALLABILITY_STATUS_UNKNOWN"
                },
                utcOffsetMinutes: -new Date().getTimezoneOffset()
            },
            request: {
                internalExperimentFlags: [{
                        key: "force_music_enable_outertube_tastebuilder_browse",
                        value: "true"
                    },
                    {
                        key: "force_music_enable_outertube_playlist_detail_browse",
                        value: "true"
                    },
                    {
                        key: "force_music_enable_outertube_search_suggestions",
                        value: "true"
                    },
                ],
                sessionIndex: {}
            },
            user: {
                enableSafetyMode: false
            }
        }
    };
};
exports.createApiContext = createApiContext;
var getCategoryURI = function (categoryName) {
    var b64Key = '';
    switch (categoryName === null || categoryName === void 0 ? void 0 : categoryName.toUpperCase()) {
        case 'SONG':
            b64Key = 'RAAGAAgACgA';
            break;
        case 'VIDEO':
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
        return "Eg-KAQwIA".concat(b64Key, "MABqChAEEAMQCRAFEAo%3D");
    }
    else {
        return null;
    }
};
exports.getCategoryURI = getCategoryURI;
var fv = function (input, query, justOne) {
    if (justOne === void 0) { justOne = false; }
    var iterate = function (x, y) {
        var r = [];
        (x === null || x === void 0 ? void 0 : x.hasOwnProperty(y)) && r.push(x[y]);
        if (justOne && x.hasOwnProperty(y)) {
            return r.shift();
        }
        if (Array.isArray(x)) {
            for (var i = 0; i < x.length; i++) {
                r = r.concat(iterate(x[i], y));
            }
        }
        else if (typeof x === 'object') {
            var c = Object.keys(x);
            if (c.length > 0) {
                for (var i = 0; i < c.length; i++) {
                    r = r.concat(iterate(x[c[i]], y));
                }
            }
        }
        return r.length == 1 ? r.shift() : r;
    };
    var d = query.split(':'), v = input;
    for (var i = 0; i < d.length; i++) {
        v = iterate(v, d[i]);
    }
    return v;
};
exports.fv = fv;
var splitArray = function (arr, sprtr) {
    var h = [], newArr = [];
    arr.forEach(function (element) {
        if (sprtr(element)) {
            h.push(newArr);
            newArr = [];
        }
        else {
            newArr.push(element);
        }
    });
    if (newArr.length !== 0) {
        h.push(newArr);
    }
    return h;
};
exports.splitArray = splitArray;
var hms2s = function (v) {
    try {
        var p = v.split(':'), s = 0, f = 1;
        while (p.length > 0) {
            s += f * parseInt(p.pop(), 10);
            f *= 60;
        }
        return s;
    }
    catch (e) {
        return 0;
    }
};
exports.hms2s = hms2s;
var toAuthorData = function (data, album) {
    var serialize = function (x) {
        var _a, _b;
        return {
            name: x.text,
            browseId: (_b = (_a = x.navigationEndpoint) === null || _a === void 0 ? void 0 : _a.browseEndpoint) === null || _b === void 0 ? void 0 : _b.browseId
        };
    };
    var a = data[album ? 2 : 1].filter(function (e, i) { return i % 2 === 0; }).map(function (x) { return serialize(x); });
    return a.length == 1 ? a[0] : a;
};
exports.toAuthorData = toAuthorData;
