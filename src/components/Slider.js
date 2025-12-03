import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/slider.css';

const CustomSlider = ({ 
  items, 
  slidesToShow = 3, 
  slidesToScroll = 1, 
  autoplay = false,
  responsive = [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }
  ]
}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll,
    autoplay,
    responsive,
  };

  return (
    <div className="custom-slider">
      <Slider {...settings}>
        {items.map((item, index) => (
          <div key={index} className="slider-item">
            {item}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CustomSlider;
