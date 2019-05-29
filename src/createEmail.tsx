import React from "react";
import ReactDOMServer from "react-dom/server";

import Email from "./components/Email";

export default (data: any) => {
    const App = <Email data={data} />;
    const content = ReactDOMServer.renderToStaticMarkup(App);

    return content;
};
