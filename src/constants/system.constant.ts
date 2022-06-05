import * as pjson from '../../package.json';
import * as ormjson from '../../ormconfig.json';
// constants for basic app metadata
export const APP_TITLE: string = 'SGI-Tin Marin API'; 
export const APP_DESCRIPTION: string = pjson.description; 
export const APP_VERSION: string = pjson.version;
export const DATABASE_CONNECTION: string = ormjson.url;