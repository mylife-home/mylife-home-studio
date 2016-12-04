
'use strict';
import React from 'react';
import PropTypes from 'material-ui/utils/propTypes';
import Tooltip from 'material-ui/internal/Tooltip';
import * as muiStyles from 'material-ui/styles/index';

// https://github.com/callemall/material-ui/blob/v0.15.0-alpha.2/src/icon-button.jsx

function getStyles(props, state) {
  const {
    baseTheme,
  } = state.muiTheme;

  return {
    tooltip: {
      boxSizing: 'border-box',
    },
    icon: {
      color: baseTheme.palette.textColor,
      fill: baseTheme.palette.textColor,
    },
    overlay: {
      position: 'relative',
      top: 0,
      width: '100%',
      height: '100%',
      background: baseTheme.palette.disabledColor,
    }
  };
}

class TooltipContainer extends React.Component {

  constructor(props, context) {
    super(props);
    this.state = {
      tooltipShown: false,
      muiTheme: context.muiTheme || muiStyles.getMuiTheme()
    };
  }

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      muiTheme: nextContext.muiTheme || this.state.muiTheme,
    });
  }

  setKeyboardFocus() {
    this.refs.div.setKeyboardFocus();
  }

  _showTooltip() {
    if (this.props.tooltip) {
      this.setState({tooltipShown: true});
    }
  }

  _hideTooltip() {
    if (this.props.tooltip) this.setState({tooltipShown: false});
  }

  _handleBlur(event) {
    this._hideTooltip();
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  }

  _handleFocus(event) {
    this._showTooltip();
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  }

  _handleMouseLeave(event) {
    this._hideTooltip();
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(event);
    }
  }

  _handleMouseOut(event) {
    if (this.props.onMouseOut) {
      this.props.onMouseOut(event);
    }
  }

  _handleMouseEnter(event) {
    this._showTooltip();
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(event);
    }
  }

  render() {
    const {
      touch,
      tooltip,
      tooltipPosition,
      ...otherProps
    } = this.props;

    const styles = getStyles(this.props, this.state);
    const splittedTooltipPosition = tooltipPosition.split('-');

    const tooltipElement = tooltip ? (
      <Tooltip
        ref="tooltip"
        label={tooltip}
        show={this.state.tooltipShown}
        touch={touch}
        style={Object.assign(styles.tooltip, this.props.tooltipStyles)}
        verticalPosition={splittedTooltipPosition[0]}
        horizontalPosition={splittedTooltipPosition[1]}
      />
    ) : null;

    return (
      <div
        {...otherProps}
        onBlur={this._handleBlur.bind(this)}
        onFocus={this._handleFocus.bind(this)}
        onMouseLeave={this._handleMouseLeave.bind(this)}
        onMouseEnter={this._handleMouseEnter.bind(this)}
        onMouseOut={this._handleMouseOut.bind(this)}
      >
        {tooltipElement}
        {this.props.children}
      </div>
    );
  }
}

TooltipContainer.propTypes = {

  /**
   * The text to supply to the element's tooltip.
   */
  tooltip: React.PropTypes.node,

  /**
   * The vertical and horizontal positions, respectively, of the element's tooltip.
   * Possible values are: "bottom-center", "top-center", "bottom-right", "top-right",
   * "bottom-left", and "top-left".
   */
  tooltipPosition: PropTypes.cornersAndCenter,

  /**
   * Override the inline-styles of the tooltip element.
   */
  tooltipStyles: React.PropTypes.object,

  /**
   * If true, increase the tooltip element's size.  Useful for increasing tooltip
   * readability on mobile devices.
   */
  touch: React.PropTypes.bool,

  children: React.PropTypes.node,

  onBlur: React.PropTypes.func,
  onFocus: React.PropTypes.func,
  onMouseLeave: React.PropTypes.func,
  onMouseOut: React.PropTypes.func,
  onMouseEnter: React.PropTypes.func
};

TooltipContainer.contextTypes = {
  muiTheme: React.PropTypes.object
};

TooltipContainer.childContextTypes = {
  muiTheme: React.PropTypes.object
};

TooltipContainer.defaultProps = {
  tooltipPosition: 'bottom-center',
  touch: false
};


export default TooltipContainer;
