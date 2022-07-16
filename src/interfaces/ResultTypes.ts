import { InfoTypes } from "./InfoTypes";

export interface GeneralInfo {
    type: InfoTypes,
    name: string,
    thumbnails: any
}

export interface AuthorData {
    name: string,
    browseId?: string
}

export interface SongInfo extends GeneralInfo {
    artists: AuthorData | AuthorData[],
    album: AuthorData,
    duration: number,
    videoId: string,
    playlistId: string,
    params: string
}

export interface VideoInfo extends GeneralInfo {
    author: AuthorData,
    views: string,
    duration: number,
    videoId: string,
    playlistId: string,
    params: string
}

export interface ArtistInfo extends GeneralInfo {
    browseId: string
}

export interface AlbumInfo extends GeneralInfo {
    browseId: string,
    artists: AuthorData | AuthorData[],
    year: number,
    playlistId: string
}

export interface PlaylistInfo extends GeneralInfo {
    browseId: string,
    author: AuthorData,
    count: number
}
