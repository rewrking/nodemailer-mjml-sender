import React from "react";
import Grid from "./Grid";
import Header from "./Header";

interface EmailProps {
    data: any;
}

export default (props: EmailProps) => {
    return (
        <Grid>
            <Header label="Cat Facts!" />
            <Grid.Row>{props.data}</Grid.Row>
        </Grid>
    );
};
