import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const Togglable = forwardRef((props, refs) => {
  const [formVisible, setFormVisible] = useState(false);

  const hideForm = { display: formVisible ? 'none' : '' };
  const showForm = { display: formVisible ? '' : 'none' };

  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleFormVisibility,
    };
  });

  return (
    <div>
      <div style={hideForm}>
        <Button variant="primary" onClick={toggleFormVisibility}>
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showForm}>
        {props.children}
        <Button variant="secondary" onClick={toggleFormVisibility}>
          Cancel
        </Button>
      </div>
    </div>
  );
});

Togglable.displayName = 'Togglable';

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default Togglable;
