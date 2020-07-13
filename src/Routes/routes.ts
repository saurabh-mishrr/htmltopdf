
import {convert} from "../Controllers/HtmlToPdfController";

let req:Request;
let res:Response;
export function routes(app:any) {
    app.route('/convert').post(convert);
}