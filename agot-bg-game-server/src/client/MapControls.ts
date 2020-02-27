import Region from "../common/ingame-game-state/game-data-structure/Region";
import Unit from "../common/ingame-game-state/game-data-structure/Unit";
import Order from "../common/ingame-game-state/game-data-structure/Order";
import {observable} from "mobx";
import PartialRecursive from "../utils/PartialRecursive";

interface HighlightProperties {
    active: boolean;
    color: "white" | "yellow";
}

export interface RegionOnMapProperties {
    highlight: HighlightProperties;
    onClick: (() => void) | null;
}

export interface UnitOnMapProperties {
    highlight: HighlightProperties;
    onClick: (() => void) | null;
}

export interface OrderOnMapProperties {
    highlight: HighlightProperties;
    onClick: (() => void) | null;
}

export default class MapControls {
    @observable modifyRegionsOnMap: (() => [Region, PartialRecursive<RegionOnMapProperties>][])[] = [];
    @observable modifyUnitsOnMap: (() => [Unit, PartialRecursive<UnitOnMapProperties>][])[] = [];
    @observable modifyOrdersOnMap: (() => [Region, PartialRecursive<OrderOnMapProperties>][])[] = [];
}
