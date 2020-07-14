
import {convert} from "../Controllers/HtmlToPdfController";

export function routes(app: any) {
    app.route('/convert').post(convert);
}