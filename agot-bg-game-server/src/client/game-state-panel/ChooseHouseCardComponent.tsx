import {observer} from "mobx-react";
import * as React from "react";
import {Component} from "react";
import ChooseHouseCardGameState
    from "../../common/ingame-game-state/action-game-state/resolve-march-order-game-state/combat-game-state/choose-house-card-game-state/ChooseHouseCardGameState";
import HouseCard from "../../common/ingame-game-state/game-data-structure/house-card/HouseCard";
import GameStateComponentProps from "./GameStateComponentProps";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import HouseCardComponent from "./utils/HouseCardComponent";
import { observable } from "mobx";

@observer
export default class ChooseHouseCardComponent extends Component<GameStateComponentProps<ChooseHouseCardGameState>> {
    @observable selectedHouseCard: HouseCard | null;
    @observable dirty: boolean;

    get chosenHouseCard(): HouseCard | null {
        return this.props.gameClient.authenticatedPlayer
            ? this.props.gameState.houseCards.tryGet(this.props.gameClient.authenticatedPlayer.house, null)
            : null;
    }

    constructor(props: GameStateComponentProps<ChooseHouseCardGameState>) {
        super(props);

        const authenticatedPlayer = this.props.gameClient.authenticatedPlayer;

        this.selectedHouseCard = this.chosenHouseCard;

        this.dirty = authenticatedPlayer
            ? !this.props.gameState.houseCards.has(authenticatedPlayer.house)
            :  false;
    }

    render(): JSX.Element {
        return (
            <>
                <Col xs={12}>
                    The attacker and the defender must choose a House Card
                </Col>
                {this.shouldChooseHouseCard() && (
                    <>
                        <Col xs={12}>
                            <Row className="justify-content-center">
                                {this.getChoosableHouseCards().map(hc => (
                                    <Col xs="auto" key={hc.id}>
                                        <HouseCardComponent
                                            houseCard={hc}
                                            size="small"
                                            selected={this.selectedHouseCard == hc}
                                            onClick={() => {
                                                if (hc != this.selectedHouseCard) {
                                                    this.selectedHouseCard = hc;
                                                    this.dirty = this.selectedHouseCard != this.chosenHouseCard;
                                                }
                                            }}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                        <Col xs={12}>
                                <Button onClick={() => this.chooseHouseCard()} disabled={!this.dirty}>
                                    Confirm
                                </Button>
                        </Col>
                    </>
                )}
                <Col xs={12}>
                    <div>
                        Waiting for {this.props.gameState.getWaitingForHouses().map(h => h.name).join(" and ")} to choose their House Cards...
                    </div>
                </Col>
            </>
        );
    }

    shouldChooseHouseCard(): boolean {
        return this.props.gameState.combatGameState.houseCombatDatas.keys.some(h => this.props.gameClient.doesControlHouse(h));
    }

    chooseHouseCard(): void {
        if(!this.selectedHouseCard) {
            return;
        }

        this.props.gameState.chooseHouseCard(this.selectedHouseCard);
        this.dirty = false;
    }

    getChoosableHouseCards(): HouseCard[] {
        if (!this.props.gameClient.authenticatedPlayer) {
            return [];
        }

        const commandedHouse = this.props.gameState.combatGameState.getCommandedHouseInCombat(this.props.gameClient.authenticatedPlayer.house);

        return this.props.gameState.getChoosableCards(commandedHouse).sort((a, b) => a.combatStrength - b.combatStrength);
    }
}
