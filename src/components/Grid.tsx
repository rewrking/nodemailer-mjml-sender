import React from "react";

interface IChildren {
    children: React.ReactNode;
}

const Cell = (props: IChildren) => {
    return <td>{props.children}</td>;
};

const Row = (props: IChildren) => {
    return (
        <tr>
            {React.Children.map(props.children, (el: any) => {
                if (el.type === Cell) return el;

                return <td>{el}</td>;
            })}
        </tr>
    );
};

export const Grid = (props: IChildren) => {
    return (
        <table>
            <tbody>
                {React.Children.map(props.children, (el: any) => {
                    if (!el) return;

                    if (el.type === Row) return el;

                    if (el.type === Cell) {
                        return <tr>{el}</tr>;
                    }

                    return (
                        <tr>
                            <td>{el}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

Grid.Row = Row;
Grid.Cell = Cell;

export default Grid;
