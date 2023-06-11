import { Fraction, format } from "mathjs"

interface Props {
    odds: Fraction
}

export default function BallLottery({ odds }: Props) {
    /**
     * Returns JSX display of the lottery that has the given odds.
     * @param odds Odds of the lottery.
     */
    function renderBalls(odds: Fraction) {
        const numerator: number = odds.n;
        const denominator: number = odds.d;
        const balls = [];

        let i = 0;

        for (; i < numerator; i++) {
            balls.push(<span key={i}>●</span>);
        }

        for (; i < numerator + denominator; i++) {
            balls.push(<span key={i}>○</span>);
        }

        return balls;
    }
    return (
        <div>
            <label>Lottery Odds:
                <span>{format(odds)}</span>
            </label>

            <div>
                {renderBalls(odds)}
            </div>
        </div>
    )
}