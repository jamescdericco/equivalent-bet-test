import { Fraction } from "mathjs";
import { useState } from "react";
import { Wheel } from "react-custom-roulette";

import { simulateOdds } from "./probability";

/**
 * Props for the Wheel Lottery component.
 * 
 * @param odds The odds of winning the lottery.
 */
interface Props {
    odds: Fraction
}

/**
 * Returns the Wheel Lottery component.
 * 
 * Must be rendered in a dynamic import with nextjs SSR disabled.
 */
export default function WheelLottery({ odds }: Props) {
    const [mustSpin, setMustSpin] = useState<boolean>(false);
    const [prizeNumber, setPrizeNumber] = useState<number>(0);

    function handleWheelClick() {
        // one spin at a time
        if (!mustSpin) {
            const newPrizeNumber = simulateOdds(odds) ? 0 : 1;
            setPrizeNumber(newPrizeNumber);
            setMustSpin(true);
        }
    }

    return (
        <div onClick={handleWheelClick} style={{ display: 'inline-block' }} >
            <Wheel
                mustStartSpinning={mustSpin}
                onStopSpinning={() => { setMustSpin(false); }}
                prizeNumber={prizeNumber}
                data={[
                    {
                        option: 'Win',
                        optionSize: odds.n,
                        style: { backgroundColor: 'green' }
                    },
                    {
                        option: 'Lose',
                        optionSize: odds.d,
                        style: { backgroundColor: 'red' }
                    }
                ]}
                radiusLineWidth={0}
            />
        </div>
    );
}