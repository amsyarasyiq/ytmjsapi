"use strict";
exports.__esModule = true;
exports.parseSearchResult = void 0;
var utils = require("./utils");
var InfoTypes_1 = require("../interfaces/InfoTypes");
var parseSearchResult = function (context, parseType) {
    var content = [];
    var sectionList = utils.fv(context, 'musicResponsiveListItemRenderer');
    if (!Array.isArray(sectionList)) {
        sectionList = [sectionList];
    }
    sectionList.forEach(function (sectionContext) {
        var _a, _b;
        var flexColumnRenderer = utils.fv(sectionContext, 'musicResponsiveListItemFlexColumnRenderer');
        var flexColumn = flexColumnRenderer.concat();
        var navText = utils.splitArray(utils.fv(flexColumn === null || flexColumn === void 0 ? void 0 : flexColumn[1], 'runs'), function (x) { return x.text === ' • '; });
        var type = parseType !== null && parseType !== void 0 ? parseType : navText[0][0].text.toLowerCase();
        if (parseType && ['song', 'video', 'playlist'].includes(parseType)) {
            navText.unshift([{ text: parseType }]);
        }
        switch (type) {
            case InfoTypes_1.InfoTypes.Song: {
                var data = {
                    type: type,
                    videoId: utils.fv(sectionContext, 'playNavigationEndpoint:videoId'),
                    playlistId: utils.fv(sectionContext, 'playNavigationEndpoint:playlistId'),
                    name: utils.fv(flexColumn === null || flexColumn === void 0 ? void 0 : flexColumn[0], 'runs:text'),
                    artists: utils.toAuthorData(navText),
                    album: utils.toAuthorData(navText, true),
                    duration: utils.hms2s(navText[3][0].text),
                    thumbnails: utils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails'),
                    params: utils.fv(sectionContext, 'playNavigationEndpoint:params')
                };
                content.push(Object.freeze(data));
                break;
            }
            case InfoTypes_1.InfoTypes.Video: {
                var data = {
                    type: type,
                    videoId: utils.fv(sectionContext, 'playNavigationEndpoint:videoId'),
                    playlistId: utils.fv(sectionContext, 'playNavigationEndpoint:playlistId'),
                    name: utils.fv(flexColumn === null || flexColumn === void 0 ? void 0 : flexColumn[0], 'runs:text'),
                    author: utils.toAuthorData(navText),
                    views: (_a = navText[2]) === null || _a === void 0 ? void 0 : _a[0].text,
                    duration: utils.hms2s(navText[3][0].text),
                    thumbnails: utils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails'),
                    params: utils.fv(sectionContext, 'playNavigationEndpoint:params')
                };
                content.push(Object.freeze(data));
                break;
            }
            case InfoTypes_1.InfoTypes.Artist: {
                var data = {
                    type: type,
                    browseId: utils.fv(sectionContext.navigationEndpoint, 'browseEndpoint:browseId'),
                    name: utils.fv(flexColumn === null || flexColumn === void 0 ? void 0 : flexColumn[0], 'runs:text'),
                    thumbnails: utils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails')
                };
                content.push(Object.freeze(data));
                break;
            }
            case InfoTypes_1.InfoTypes.EP:
            case InfoTypes_1.InfoTypes.Single:
            case InfoTypes_1.InfoTypes.Album: {
                var data = {
                    type: type,
                    browseId: utils.fv(sectionContext.navigationEndpoint, 'browseEndpoint:browseId'),
                    playlistId: utils.fv(sectionContext, 'playNavigationEndpoint:playlistId'),
                    name: utils.fv(flexColumn === null || flexColumn === void 0 ? void 0 : flexColumn[0], 'runs:text'),
                    artists: utils.toAuthorData(navText),
                    year: (_b = utils.fv(flexColumn === null || flexColumn === void 0 ? void 0 : flexColumn[1], 'runs:text')) === null || _b === void 0 ? void 0 : _b[4],
                    thumbnails: utils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails')
                };
                content.push(Object.freeze(data));
                break;
            }
            case InfoTypes_1.InfoTypes.Playlist: {
                var data = {
                    type: type,
                    browseId: utils.fv(sectionContext.navigationEndpoint, 'browseEndpoint:browseId'),
                    name: utils.fv(flexColumn === null || flexColumn === void 0 ? void 0 : flexColumn[0], 'runs:text'),
                    author: utils.toAuthorData(navText),
                    count: parseInt(navText[2][0].text.split(' ').shift()),
                    thumbnails: utils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails')
                };
                content.push(Object.freeze(data));
                break;
            }
            default:
                break;
        }
    });
    return content;
};
exports.parseSearchResult = parseSearchResult;
