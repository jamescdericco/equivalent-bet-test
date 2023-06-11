import { Fraction, format } from "mathjs"

interface Props {
    odds: Fraction
}

export default function BallLottery({ odds }: Props) {
    /**
     * Returns JSX display of the lottery that has the given odds.
     * 
     * @param odds Odds of the lottery.
     * @param maxColumns Maximum number of columns to display. If null or zero, then all balls will be displayed in one row.
     */
    function renderBalls(odds: Fraction, maxColumns: number | null = null) {
        const numerator: number = odds.n;
        const denominator: number = odds.d;
        const jsx = [];
        const numBalls = numerator + denominator;

        let columnIndex = 0; // column index

        for (let i = 0; i < numBalls; i++) {
            jsx.push(<span key={i}>{i < numerator ? '●' : '○'}</span>);

            columnIndex++;
            if (maxColumns && columnIndex >= maxColumns) {
                jsx.push(<br key={i + 'br'} />);
                columnIndex = 0;
            }
        }

        return jsx;
    }
    return (
        <div>
            <label>Lottery Odds:
                <span>{format(odds)}</span>
            </label>

            <div>
                {renderBalls(odds, 40)}
            </div>
        </div>
    )
}