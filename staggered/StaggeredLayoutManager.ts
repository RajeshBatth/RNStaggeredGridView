import {Dimension, Layout, LayoutManager, LayoutProvider, Point} from "recyclerlistview";

export default class StaggeredLayoutManager extends LayoutManager {
    private _layoutProvider: LayoutProvider;
    private _window: Dimension;
    private _totalHeight: number;
    private _totalWidth: number;
    private _layouts: Layout[];
    private _numberOfColumns: number;

    constructor(layoutProvider: LayoutProvider, renderWindowSize: Dimension, numberOfColumns: number, cachedLayouts?: Layout[]) {
        super();
        this._layoutProvider = layoutProvider;
        this._window = renderWindowSize;
        this._totalHeight = 0;
        this._totalWidth = 0;
        this._layouts = cachedLayouts ? cachedLayouts : [];
        this._numberOfColumns = numberOfColumns;
    }

    public getContentDimension(): Dimension {
        return {height: this._totalHeight, width: this._totalWidth};
    }

    public getLayouts(): Layout[] {
        return this._layouts;
    }

    public getOffsetForIndex(index: number): Point {
        if (this._layouts.length > index) {
            return {x: this._layouts[index].x, y: this._layouts[index].y};
        } else {
            throw new Error("No layout available for index: " + index);
        }
    }

    public overrideLayout(index: number, dim: Dimension): boolean {
        const layout = this._layouts[index];
        if (layout) {
            layout.isOverridden = true;
            layout.width = dim.width;
            layout.height = dim.height;
        }
        return true;
    }

    public setMaxBounds(itemDim: Dimension): void {
        itemDim.width = Math.min(this._window.width, itemDim.width);
    }

    //TODO:Talha laziliy calculate in future revisions
    public relayoutFromIndex(startIndex: number, itemCount: number): void {
        console.log('relayoutFromIndex', startIndex, itemCount)
        startIndex = this._locateFirstNeighbourIndex(startIndex);
        let startX = 0;
        let startY = 0;
        let maxBound = 0;

        const startVal = this._layouts[startIndex];

        if (startVal) {
            startX = startVal.x;
            startY = startVal.y;
            this._pointDimensionsToRect(startVal);
        }

        const oldItemCount = this._layouts.length;
        const itemDim = {height: 0, width: 0};
        let itemRect = null;

        let oldLayout = null;
        const horizontalOffsets: number[] = [];
        for (let i = 0; i < this._numberOfColumns; i++) {
            let offset = i * (this._window.width / this._numberOfColumns);
            horizontalOffsets.push(offset)
        }

        const verticalOffsets: number[] = new Array(this._numberOfColumns).fill(0);

        for (let i = startIndex; i < itemCount; i++) {
            oldLayout = this._layouts[i];
            const layoutType = this._layoutProvider.getLayoutTypeForIndex(i);
            if (oldLayout && oldLayout.isOverridden && oldLayout.type === layoutType) {
                itemDim.height = oldLayout.height;
                itemDim.width = oldLayout.width;
            } else {
                this._layoutProvider.setComputedLayout(layoutType, itemDim, i);
            }
            this.setMaxBounds(itemDim);

            let smallestColumnIndex = 0;
            let minY = Number.MAX_SAFE_INTEGER;
            verticalOffsets.forEach((value, index) => {
               // find lowest val and put new Y into it
                if (minY > value) {
                    minY = value;
                    smallestColumnIndex = index;
                }
            });
            startX = horizontalOffsets[smallestColumnIndex];
            startY = verticalOffsets[smallestColumnIndex];
            verticalOffsets[smallestColumnIndex] += itemDim.height;
            maxBound = Math.max(...verticalOffsets)

            //TODO: Talha creating array upfront will speed this up
            if (i > oldItemCount - 1) {
                this._layouts.push({
                    x: startX,
                    y: startY,
                    height: itemDim.height,
                    width: itemDim.width,
                    type: layoutType
                });
            } else {
                itemRect = this._layouts[i];
                itemRect.x = startX;
                itemRect.y = startY;
                itemRect.type = layoutType;
                itemRect.width = itemDim.width;
                itemRect.height = itemDim.height;
            }
        }
        if (oldItemCount > itemCount) {
            this._layouts.splice(itemCount, oldItemCount - itemCount);
        }
        this._setFinalDimensions(maxBound);
    }

    private _pointDimensionsToRect(itemRect: Layout): void {
        this._totalHeight = itemRect.y;
    }

    private _setFinalDimensions(maxBound: number): void {
        this._totalWidth = this._window.width;
        this._totalHeight += maxBound;
    }

    private _locateFirstNeighbourIndex(startIndex: number): number {
        if (startIndex === 0) {
            return 0;
        }
        let i = startIndex - 1;
        for (; i >= 0; i--) {
            if (this._layouts[i].x === 0) {
                break;
            }
        }
        return i;
    }
}
