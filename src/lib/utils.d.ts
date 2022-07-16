import { AuthorData } from "../interfaces/ResultTypes";
export declare const createApiContext: (ytcfg: any) => {
    context: {
        capabilities: {};
        client: {
            clientName: any;
            clientVersion: any;
            experimentIds: never[];
            experimentsToken: string;
            gl: any;
            hl: any;
            locationInfo: {
                locationPermissionAuthorizationStatus: string;
            };
            musicAppInfo: {
                musicActivityMasterSwitch: string;
                musicLocationMasterSwitch: string;
                pwaInstallabilityStatus: string;
            };
            utcOffsetMinutes: number;
        };
        request: {
            internalExperimentFlags: {
                key: string;
                value: string;
            }[];
            sessionIndex: {};
        };
        user: {
            enableSafetyMode: boolean;
        };
    };
};
export declare const getCategoryURI: (categoryName?: string) => string | null;
export declare const fv: (input: object, query: string, justOne?: boolean) => any;
export declare const splitArray: (arr: any[], sprtr: (element: any) => boolean) => any[];
export declare const hms2s: (v: string) => number;
export declare const toAuthorData: (data: any, album?: boolean) => AuthorData;
