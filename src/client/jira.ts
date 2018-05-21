import * as WebRequest from 'web-request'
import JiraResponse from '../models/JiraResponse';

export default class JiraClient {

    token!: string;
    email!: string;

    constructor(
        email: string,
        token: string,
        flags: object
    ) {
        this.email = email;
        this.token = token;
    }

    async jqlSearch(
        uri: string,
        query: string,
        orderBy: string
    ) {
        let response: string = ''
        const result = await WebRequest.json<JiraResponse>(
            encodeURI(uri + query + orderBy), {
            auth: {
                user: this.email,
                password: this.token,
                sendImmediately: true
            },
            jar: true
            }
        )
        return result;
    }
}
