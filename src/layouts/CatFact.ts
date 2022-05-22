export interface CatFactProps {
    fact: string;
}

const CatFact = ({ fact }: CatFactProps) => {
    return /*html*/ `
        <mjml>
            <mj-head>
                <mj-font name="Raleway" href="https://fonts.googleapis.com/css?family=Raleway" />
            </mj-head>
            <mj-body>
                <mj-section background-color="#f0f0f0">
                    <mj-text align="center" color="#333" font-size="24px" font-family="Raleway" font-weight="600">
                        CAT FACTS
                    </mj-text>
                </mj-section>
                <mj-section background-color="white" padding="24px 16px">
                    <mj-text align="center" color="#333" font-size="20px" line-height="30px" font-family="Raleway">
                        ${fact}
                    </mj-text>
                </mj-section>
                <mj-section background-color="#fbfbfb"></mj-section>
            </mj-body>
        </mjml>
    `;
};

export { CatFact };
