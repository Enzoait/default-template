import React from 'react';
import ReactDOM from 'react-dom';
import ManageTeamTemplatePage from './ManageTeamTemplatePage';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ManageTeamTemplatePage />, div);
  ReactDOM.unmountComponentAtNode(div);
});
