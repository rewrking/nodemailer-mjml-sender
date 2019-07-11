import React from "react";
import { render } from "mjml-react";

import mjmlOptions from "./mjmlOptions";
import CatFact, { CatFactProps } from "./layouts/CatFact";

export default (props: CatFactProps) => {
    const result = render(<CatFact fact={props.fact} />, mjmlOptions);
    return result.html;
};
