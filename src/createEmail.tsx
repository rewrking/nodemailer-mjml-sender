import React from "react";
import { render } from "mjml-react";

import CatFact, { CatFactProps } from "./layouts/CatFact";

export default (props: CatFactProps) => {
    const result = render(<CatFact fact={props.fact} />, { validationLevel: "soft" });
    return result.html;
};
