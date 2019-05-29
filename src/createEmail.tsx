import React from "react";
import { render } from "mjml-react";

import CatFact, { CatFactProps } from "./layouts/CatFact";

import mjmlOptions from "./mjmlOptions";

export default (props: CatFactProps) => {
    const result = render(<CatFact fact={props.fact} />, mjmlOptions);
    return result.html;
};
