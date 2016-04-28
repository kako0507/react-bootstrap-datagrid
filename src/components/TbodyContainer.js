import React, {Component, PropTypes} from 'react';
import Tbody from './Tbody';

function getHeight(numItems, rowHeight, bodyHeight) {
  var fullHeight = numItems * rowHeight;
  if (fullHeight < bodyHeight) {
    return fullHeight;
  } else {
    return bodyHeight;
  }
}

class TbodyContainer extends Component {
  scrollTop = 0;
  state = {
    rowsTop: 0,
    itemsToRender: 10
  };
  constructor(props) {
    super(props);
    this._handleScroll = ::this._handleScroll;
    this._updateRowsLazyRender = ::this._updateRowsLazyRender;
  }
  componentDidMount() {
    this._updateRowsLazyRender(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this._updateRowsLazyRender(nextProps);
  }
  _handleScroll(ev) {
    const {
      tableId,
      height,
      rowHeight,
      itemPadding,
    } = this.props;
    let {itemsToRender} = this.state;
    const {scrollTop, scrollLeft} = ev.target;
    if(rowHeight > 0 && scrollTop !== this.scrollTop) {
      this.scrollTop = scrollTop;
      this._updateRowsLazyRender(this.props);
    }
    if(scrollLeft !== this.scrollLeft) {
      const thead = document.querySelector(`#thead-${tableId}`);
      thead.scrollLeft = ev.target.scrollLeft;
    }
    this.scrollLeft = scrollLeft;
  }
  _updateRowsLazyRender(props) {
    const {
      height,
      rowHeight,
      itemPadding,
      items
    } = props;
    let itemsCount = items.length;
    if(rowHeight > 0 && height > 0) {
      let rowsTop = Math.floor(this.scrollTop / rowHeight);
      let itemsToRenderHeight = getHeight(
        itemsCount,
        rowHeight,
        height
      );
      if(height && (itemsToRenderHeight < height)) {
        itemsToRenderHeight = height;
      }
      let itemsToRender = Math.ceil(itemsToRenderHeight / rowHeight);
      if(height > 0 && itemsCount < itemsToRender) {
        itemsCount = itemsToRender;
      }
      if(height === itemsToRenderHeight) {
        itemsToRender += itemPadding;
      }
      // correction
      let itemPaddingTop = 0;
      if(rowsTop >= 0 && rowsTop < itemPadding) {
        itemPaddingTop = rowsTop;
      }
      else {
        itemPaddingTop = itemPadding;
      }
      rowsTop -= itemPaddingTop;
      itemsToRender += itemPaddingTop;
      let rowsBottom = (
        itemsCount
      - rowsTop
      - itemsToRender
      );
      if(
        rowsBottom < 0
      ) {
        itemsToRender += rowsBottom;
        rowsBottom = 0;
      }
      else if(
        itemsCount * rowHeight < height
     || rowsTop + itemsToRender + rowsBottom > itemsCount
      ) {
        rowsBottom = 0;
      }
      if(
        itemsToRender > 0
     && (
          rowsTop !== this.state.rowsTop
       || rowsBottom !== this.state.rowsBottom
       || itemsToRender !== this.state.itemsToRender
        )
      ) {
        this.setState({
          rowsTop,
          rowsBottom,
          itemsToRender
        });
      }
    }
  }
  render() {
    return (
      <Tbody
        {...this.props}
        {...this.state}
        onScroll={this._handleScroll}
      />
    );
  }
}

export default TbodyContainer;
