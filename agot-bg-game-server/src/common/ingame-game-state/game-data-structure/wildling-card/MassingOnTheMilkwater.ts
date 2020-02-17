import WildlingCardType from "./WildlingCardType";
import WildlingsAttackGameState from "../../westeros-game-state/wildling-attack-game-state/WildlingAttackGameState";
import {HouseCardState} from "../house-card/HouseCard";
import MassingOnTheMilkwaterWildlingVictoryGameState
    from "../../westeros-game-state/wildling-attack-game-state/massing-on-the-milkwater-wildling-victory-game-state/MassingOnTheMilkwaterWildlingVictoryGameState";

export default class MassingOnTheMilkwater extends WildlingCardType {
    executeNightsWatchWon(wildlingAttack: WildlingsAttackGameState): void {
        const highestBidder = wildlingAttack.highestBidder;

        const usedHouseCards = highestBidder.houseCards.values.filter(hc => hc.state == HouseCardState.USED);

        usedHouseCards.forEach(hc => hc.state = HouseCardState.AVAILABLE);

        wildlingAttack.entireGame.broadcastToClients({
            type: "change-state-house-card",
            houseId: highestBidder.id,
            state: HouseCardState.AVAILABLE,
            cardIds: usedHouseCards.map(hc => hc.id)
        });

        wildlingAttack.ingame.log({
            type: "massing-on-the-milkwater-house-cards-back",
            house: highestBidder.id,
            houseCardsReturned: usedHouseCards.map(hc => hc.id)
        });

        wildlingAttack.onWildlingCardExecuteEnd();
    }

    executeWildlingWon(wildlingAttack: WildlingsAttackGameState): void {
        wildlingAttack.ingame.log({
            type: "massing-on-the-milkwater-wildling-victory",
            lowestBidder: wildlingAttack.lowestBidder.id
        });

        wildlingAttack.setChildGameState(new MassingOnTheMilkwaterWildlingVictoryGameState(wildlingAttack))
            .firstStart();
    }

}
