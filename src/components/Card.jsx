import React from 'react';
import PropTypes from 'prop-types';
import './Card.scss';

const Card = ({ 
  children, 
  variant = 'default', 
  className = '', 
  ...rest 
}) => {
  const cardClasses = [
    'card', 
    `card--${variant}`, 
    className
  ].join(' ').trim();

  return (
    <div className={cardClasses} {...rest}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'elevated', 'bordered', 'compact']),
  className: PropTypes.string
};

Card.defaultProps = {
  variant: 'default',
  className: ''
};

export default Card;
