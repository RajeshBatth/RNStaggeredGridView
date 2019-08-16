import {Dimensions} from "react-native";
import {LayoutProvider} from 'recyclerlistview'

class StaggerredGridLayoutProvider extends LayoutProvider {
  constructor() {
    super(index => {
      return "default"
    }, (type, dim) =>{
      const {width} = Dimensions.get('window');
      dim.width = width;
      dim.height = 100;
    });
  }
}

export default StaggerredGridLayoutProvider;
