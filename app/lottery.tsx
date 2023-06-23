import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import BallLottery from "./ball_lottery";
import dynamic from "next/dynamic";
import { Fraction } from "mathjs";

interface Props {
    odds: Fraction
}

/**
 * Display a lottery visualization of the given odds.
 * 
 * The user can switch between ball and wheel lottery visualizations.
 */
export function Lottery({ odds }: Props) {
    const DynamicWheelLottery = dynamic(() => import('./wheel_lottery'), {
        ssr: false,
    });

    return (
        <Tabs isFitted variant="enclosed">
            <TabList>
                <Tab>Ball Lottery</Tab>
                <Tab>Wheel Lottery</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <BallLottery odds={odds} />
                </TabPanel>
                <TabPanel>
                    <DynamicWheelLottery odds={odds} />
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
}