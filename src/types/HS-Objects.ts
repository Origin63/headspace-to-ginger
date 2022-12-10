import { email } from "./HS-Emails"
export interface hubspotResult {
    results:Array<email>,
    paging: undefined | {
        next: {
            afer: string,
            link: string
        }
    }
}