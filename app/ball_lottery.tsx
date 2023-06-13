import { Fraction } from "mathjs"
import { formatOdds } from "./probability";

interface Props {
    odds: Fraction
}

export default function BallLottery({ odds }: Props) {
    /**
     * Returns the largest factor that is less than or equal to the square root of the given number.
     * 
     * @param n Number to factor.
     * @returns the largest factor that is less than or equal to the square root of the given number.
     */
    function squarishFactors(n: number): number {
        const root = Math.sqrt(n);
        for (let i = Math.floor(root); i > 0; i--) {
            if (n % i === 0) {
                return i;
            }
        }

        throw new Error(`No squarish factors found for ${n}`);
    }

    /**
     * Returns JSX display of the lottery that has the given odds.
     * 
     * @param odds Odds of the lottery.
     * @param maxColumns Maximum number of columns to display. If null or zero, then all balls will be displayed in one row.
     */
    function renderBalls(odds: Fraction) {
        const numerator: number = odds.n;
        const denominator: number = odds.d;
        const jsx = [];
        const numBalls = numerator + denominator;
        const squarishFactor = squarishFactors(numBalls);
        const maxColumns = squarishFactor > 1 ? squarishFactor : null;

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
            <h2>
                Lottery
            </h2>
            <p>
                Picking one black ball at random from this bag of {odds.n + odds.d} balls. <em>The odds of this are {formatOdds(odds)}.</em>
            </p>

            <div>
                {renderBalls(odds)}
            </div>
        </div>
    )
}