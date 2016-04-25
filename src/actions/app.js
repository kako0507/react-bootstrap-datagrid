import dispatcher from '../dispatcher';
import actionConstants from '../constants/action';

export function updateRowWidth(maxRowWidth, hasRightScrollbar) {
  const currentTableWidth = ReactDOM.findDOMNode(this).offsetWidth;
  const {
    height,
    columnMinWidth,
    columns,
    onSelectionChange,
    selectedBy
  } = this.props;
  const {minRowWidth} = this.state;
  if(maxRowWidth > currentTableWidth) {
    maxRowWidth = minRowWidth;
  }
  else {
    maxRowWidth = currentTableWidth;
  }
  if(
    (maxRowWidth && this.state.maxRowWidth !== maxRowWidth)
 || hasRightScrollbar !== this.state.hasRightScrollbar
  ) {
    let flexColumnWidth = maxRowWidth;
    // sub width of scrollbar
    if(height > 0 && hasRightScrollbar) {
      flexColumnWidth -= 17;
    }
    if(onSelectionChange && selectedBy.indexOf('checkbox') > -1) {
      flexColumnWidth -= 40;
    }
    let numberOfAutoWidthField = columns.length;
    columns.forEach(column => {
      if(column.width) {
        numberOfAutoWidthField--;
        flexColumnWidth = flexColumnWidth - column.width;
      }
    })
    if(numberOfAutoWidthField) {
      flexColumnWidth = flexColumnWidth / numberOfAutoWidthField;
      if(flexColumnWidth < columnMinWidth) {
        flexColumnWidth = columnMinWidth;
      }
    }
    this.setState({
      maxRowWidth,
      flexColumnWidth,
      hasRightScrollbar
    });
  }
}

export function updateMinRowWidth() {
  const {
    onSelectionChange,
    selectedBy,
    columns,
    columnMinWidth
  } = this.props;
  let minRowWidth = -2;
  if(onSelectionChange && selectedBy.indexOf('checkbox') > -1) {
    minRowWidth += 40;
  }
  columns.forEach(column => {
    minRowWidth += column.width || columnMinWidth
  });
  this.setState({
    minRowWidth
  });
}
