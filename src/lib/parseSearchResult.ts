import * as utils from './utils'
import * as ResultTypes from '../interfaces/ResultTypes'
import { InfoTypes } from "../interfaces/InfoTypes"

export const parseSearchResult = (context: any, parseType?: InfoTypes): ResultTypes.GeneralInfo[] => {
    const content: ResultTypes.GeneralInfo[] = [];

    var sectionList: object[] = utils.fv(context, 'musicResponsiveListItemRenderer');
    if (!Array.isArray(sectionList)) {
        sectionList = [sectionList];
    }

    sectionList.forEach((sectionContext: any) => {
        const flexColumnRenderer: object[] = utils.fv(sectionContext, 'musicResponsiveListItemFlexColumnRenderer');
        const flexColumn = flexColumnRenderer.concat();
        
        const navText = utils.splitArray(utils.fv(flexColumn?.[1], 'runs'), x => x.text === ' • ');
        let type: InfoTypes = parseType ?? navText[0][0].text.toLowerCase();

        if (parseType && ['song', 'video', 'playlist'].includes(parseType)) {
            navText.unshift([{ text: parseType }]);
        }

        switch (type) {
            case InfoTypes.Song: {
                let data: ResultTypes.SongInfo = {
                    type,
                    videoId: utils.fv(sectionContext, 'playNavigationEndpoint:videoId'),
                    playlistId: utils.fv(sectionContext, 'playNavigationEndpoint:playlistId'),
                    name: utils.fv(flexColumn?.[0], 'runs:text'),
                    artists: utils.toAuthorData(navText),
                    album: utils.toAuthorData(navText, true),
                    duration: utils.hms2s(navText[3][0].text),
                    thumbnails: utils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails'),
                    params: utils.fv(sectionContext, 'playNavigationEndpoint:params')
                }
                content.push(Object.freeze(data));
                break;
            }
            case InfoTypes.Video: {
                let data: ResultTypes.VideoInfo = {
                    type,
                    videoId: utils.fv(sectionContext, 'playNavigationEndpoint:videoId'),
                    playlistId: utils.fv(sectionContext, 'playNavigationEndpoint:playlistId'),
                    name: utils.fv(flexColumn?.[0], 'runs:text'),
                    author: utils.toAuthorData(navText),
                    views: navText[2]?.[0].text,
                    duration: utils.hms2s(navText[3][0].text),
                    thumbnails: utils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails'),
                    params: utils.fv(sectionContext, 'playNavigationEndpoint:params'),
                }
                content.push(Object.freeze(data));
                break;
            }
            case InfoTypes.Artist: {
                let data: ResultTypes.ArtistInfo = {
                    type,
                    browseId: utils.fv(sectionContext.navigationEndpoint, 'browseEndpoint:browseId'),
                    name: utils.fv(flexColumn?.[0], 'runs:text'),
                    thumbnails: utils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails')
                }
                content.push(Object.freeze(data));
                break;
            }
            case InfoTypes.EP:
            case InfoTypes.Single:
            case InfoTypes.Album: {
                let data: ResultTypes.AlbumInfo = {
                    type,
                    browseId: utils.fv(sectionContext.navigationEndpoint, 'browseEndpoint:browseId'),
                    playlistId: utils.fv(sectionContext, 'playNavigationEndpoint:playlistId'),
                    name: utils.fv(flexColumn?.[0], 'runs:text'),
                    artists: utils.toAuthorData(navText),
                    year: utils.fv(flexColumn?.[1], 'runs:text')?.[4],
                    thumbnails: utils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails')
                }
                content.push(Object.freeze(data))
                break
            }
            case InfoTypes.Playlist: {
                let data: ResultTypes.PlaylistInfo = {
                    type,
                    browseId: utils.fv(sectionContext.navigationEndpoint,
                        'browseEndpoint:browseId'
                    ),
                    name: utils.fv(flexColumn?.[0], 'runs:text'),
                    author: utils.toAuthorData(navText),
                    count: parseInt(navText[2][0].text.split(' ').shift()),
                    thumbnails: utils.fv(sectionContext, 'musicThumbnailRenderer:thumbnails')
                }
                content.push(Object.freeze(data));
                break;
            }
            default:
                break;
        }
    })
    return content;
}
