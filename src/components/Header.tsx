import React, { CSSProperties } from "react";

const style: CSSProperties = {
    fontSize: "24px",
    fontWeight: "bold",
    marginTop: "5px",
    marginBottom: "10px"
};

interface Props {
    label: string;
}

export default (props: Props) => {
    return (
        <h1 style={style} className="title-heading">
            {props.label}
        </h1>
    );
};
