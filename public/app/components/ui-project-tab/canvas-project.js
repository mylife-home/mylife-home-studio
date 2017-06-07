'use strict';

import React from 'react';
import * as mui from 'material-ui';
import Handlebars from 'handlebars/dist/handlebars.js';
import commonStyles from './canvas-styles';

Handlebars.registerHelper('eachComponent', (options) => {
  let ret = '';
  for(const component of options.data.root.components.values()) {
    ret += options.fn(component, { data: { ... options.data }, blockParams: [ component ]});
  }
  return ret;
});

Handlebars.registerHelper('eachAttribute', (component, options) => {
  let ret = '';
  for(const attribute of component.plugin.clazz.attributes) {
    ret += options.fn(attribute, { data: { ... options.data }, blockParams: [ attribute ]});
  }
  return ret;
});

Handlebars.registerHelper('eachAction', (component, options) => {
  let ret = '';
  for(const action of component.plugin.clazz.actions) {
    ret += options.fn(action, { data: { ... options.data }, blockParams: [ action ]});
  }
  return ret;
});

Handlebars.registerHelper('eachActionWithoutArgument', (component, options) => {
  let ret = '';
  for(const action of component.plugin.clazz.actions.filter(a => !a.types.length)) {
    ret += options.fn(action, { data: { ... options.data }, blockParams: [ action ]});
  }
  return ret;
});

Handlebars.registerHelper('json', (context) => JSON.stringify(context));

const styles = {
  container: {
    ... commonStyles.container,
    display       : 'flex',
    flexDirection : 'column'
  },
  buttons: {
    width: '100%',
    flex: '0 0 36px'
  },
  button: {
    margin : 10
  },
  template: {
    margin  : 10,
    padding : 10,
    flex    : 1
  },
  output: {
    margin  : 10,
    padding : 10,
    flex    : 1
  }
};

const templates = {
  'Actions' : `
{{#eachComponent as |component|}}
  {{#eachActionWithoutArgument component as |action|}}
    component="{{ component.id }}" action="{{ action.name }}"
  {{/eachActionWithoutArgument}}
{{/eachComponent}}
  `,
  // 'Other title' : 'Other template'
};

class CanvasProject extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      template : '',
      output   : ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.project === this.props.project) { return; }
    this.setState({ output : this.execute({ project: nextProps.project }) });
  }

  execute({ template, project }) {
    template = template || this.state.template;
    project = project || this.props.project;
    try {
      const binary = Handlebars.compile(template, { noEscape: true });
      return binary(project);
    } catch(err) {
      console.error(template, project, err); // eslint-disable-line no-console
      return err.toString();
    }
  }

  templateChange(value) {
    this.setState({
      template : value,
      output   : this.execute({ template: value })
    });
  }

  render() {
    const { template, output } = this.state;

    return (
      <div style={styles.container}>
        <div style={styles.buttons}>
          {Object.keys(templates).map(name => (
            <mui.RaisedButton key={name} style={styles.button} label={name} onTouchTap={() => this.templateChange(templates[name])} />
          ))}
        </div>
        <mui.Paper style={styles.template}>
          <mui.TextField id="template" fullWidth={true} multiLine={true} value={template} onChange={e => this.templateChange(e.target.value)} />
        </mui.Paper>
        <mui.Paper style={styles.output}>
          <mui.TextField id="output" fullWidth={true} multiLine={true} value={output} onChange={() => {}} />
        </mui.Paper>
      </div>
    );
  }
}

CanvasProject.propTypes = {
  project : React.PropTypes.object.isRequired,
};

export default CanvasProject;