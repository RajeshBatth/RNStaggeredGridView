import {Dimension, Layout, LayoutManager, LayoutProvider} from 'recyclerlistview'
import StaggeredLayoutManager from "./StaggeredLayoutManager";

class StaggeredGridLayoutProvider extends LayoutProvider {

    private _lastLayoutManager1: LayoutManager;
    private readonly _numberOfColumns: number;

    constructor(getLayoutTypeForIndex: (index: number) => string | number, setLayoutForType: (type: string | number, dim: Dimension, index: number) => void, numberOfColumns: number) {
        super(getLayoutTypeForIndex, setLayoutForType);
        this._numberOfColumns = numberOfColumns;
    }

    public newLayoutManager(renderWindowSize: Dimension, isHorizontal?: boolean, cachedLayouts?: Layout[]): LayoutManager {
        this._lastLayoutManager1 = new StaggeredLayoutManager(this, renderWindowSize, this._numberOfColumns, cachedLayouts);
        return this._lastLayoutManager1;
    }

}

export default StaggeredGridLayoutProvider;
