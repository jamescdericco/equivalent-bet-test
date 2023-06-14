import { Fraction } from "mathjs";
import { Wheel } from "react-custom-roulette";

interface Props {
    odds: Fraction
}

/**
 * Returns the Wheel Lottery component.
 * 
 * Must be rendered in a dynamic import with nextjs SSR disabled.
 */
export default function WheelLottery({ odds }: Props) {
    return (
        <div>
            <h2>
                Wheel Lottery
            </h2>
            <Wheel mustStartSpinning={true} prizeNumber={0} data={[
                { option: 'Win', optionSize: odds.n, style: { backgroundColor: 'green' } },
                { option: 'Lose', optionSize: odds.d, style: { backgroundColor: 'red' } }
            ]} />
        </div>
    );
}