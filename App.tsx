import React, {Component} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';
import StaggerredGridLayoutProvider from "./staggered/StaggeredGridLayoutProvider";

const getData = () => {
    const data = []
    for (let i = 0; i < 150; i++) {
        data.push({
            id: Date.now(),
            name: 'Item ' + i
        })
    }
    return data;
}

const colors = [
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#673AB7",
    "#3F51B5",
    "#2196F3",
    "#00BCD4",
    "#009688",
]

const heights = {
    medium: 70,
    small: 100,
    large: 256,
    default: 180,
}

export const NUM_COLUMNS = 3;

export default class App extends Component {
    private _dataProvider: DataProvider;
    private _layoutProvider: LayoutProvider;

    constructor(props) {
        super(props);
        this._dataProvider = new DataProvider((r1, r2) => {
            if (r1.viewType !== r2.viewType) {
                return false;
            }
            if (r1.viewType === "default") {
                return r1.id !== r2.id;
            }
            return r1.tripKey !== r2.tripKey;
        });
        this._dataProvider = this._dataProvider.cloneWithRows(getData())

        this._layoutProvider = new StaggerredGridLayoutProvider(index => {
            if (index % 3 === 0) {
                return "small"
            }
            if (index % 2 === 0) {
                return "medium"
            }
            if (index % 5 === 0) {
                return "large"
            }
            return "default"
        }, (type, dim) => {
            const {width} = Dimensions.get('window');
            dim.width = Math.round(width / NUM_COLUMNS);
            dim.height = heights[type]
        }, NUM_COLUMNS)
    }

    _rowRenderer = (type, data, index) => {
        let height = heights[type];
        const color = colors[(index % colors.length)]
        return <View style={{
            height,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
            backgroundColor: color
        }}>
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 22}}>{data.name}</Text>
        </View>
    };

    render() {
        return (
            <View style={styles.container}>
                <RecyclerListView
                    renderAheadOffset={15000}
                    layoutProvider={this._layoutProvider}
                    dataProvider={this._dataProvider}
                    rowRenderer={this._rowRenderer}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
