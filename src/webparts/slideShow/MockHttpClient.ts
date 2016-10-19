import { ISPList } from './SlideShowWebPart';

export default class MockHttpClient {

    private static _items: ISPList[] = [{ Title: 'Mock List', Id: '1' , EncodedAbsUrl: 'http://www.subgressive.com/Lists/Photos/schrodingers-cat2.jpg' }];

    public static get(restUrl: string, options?: any): Promise<ISPList[]> {
    return new Promise<ISPList[]>((resolve) => {
            resolve(MockHttpClient._items);
        });
    }
}