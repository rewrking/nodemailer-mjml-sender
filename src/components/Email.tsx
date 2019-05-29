import React from "react";
import { Mjml, Body, Head, Section, Text, Font } from ".";

interface EmailProps {
    data: any;
}

export default (props: EmailProps) => {
    return (
        <Mjml>
            <Head>
                <Font name="Raleway" href="https://fonts.googleapis.com/css?family=Raleway" />
            </Head>
            <Body>
                <Section backgroundColor="#f0f0f0">
                    <Text align="center" color="#333" fontSize="24px" fontFamily="Raleway" fontWeight={600}>
                        CAT FACTS
                    </Text>
                </Section>
                <Section backgroundColor="white" padding="24px 16px">
                    <Text align="center" color="#333" fontSize="20px" lineHeight="30px" fontFamily="Raleway">
                        %CAT_FACT%
                    </Text>
                </Section>
                <Section backgroundColor="#fbfbfb"> </Section>
            </Body>
        </Mjml>
    );
};
