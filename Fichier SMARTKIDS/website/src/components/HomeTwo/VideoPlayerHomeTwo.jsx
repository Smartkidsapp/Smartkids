import React, { useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import videoSlideOne from '../../assets/images/video-slide-1.jpg';
import videoSlideTwo from '../../assets/images/video-slide-2.jpg';
import videoThumb from '../../assets/images/video.png';
import PopupVideo from '../PopupVideo.jsx';

function VideoPlayerHomeTwo({ className }) {
    const [showVideo, setshowVideoValue] = useState(false);
    const handleVideoShow = (e) => {
        e.preventDefault();
        setshowVideoValue(!showVideo);
    };
    const sliderRef = useRef();
    const settings = {
        autoplay: true,
        arrows: false,
        dots: false,
    };
    const sliderNext = () => {
        sliderRef.current.slickNext();
    };
    const sliderPrev = () => {
        sliderRef.current.slickPrev();
    };
    return (
        <>
            {showVideo && (
                <PopupVideo
                    handler={(e) => handleVideoShow(e)}
                    videoSrc="//www.youtube.com/embed/TlTHsI0DVow?autoplay=1"
                />
            )}
            <section className={`appie-video-player-area pt-120 pb-60 ${className || ''}`}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="appie-video-player-item">
                                <div className="thumb">
                                    <img src={videoThumb} alt="" />
                                    <div className="video-popup">
                                        <a
                                            onClick={(e) => handleVideoShow(e)}
                                            role="button"
                                            href="#"
                                            className="appie-video-popup"
                                        >
                                            <i className="fas fa-play" />
                                        </a>
                                    </div>
                                </div>
                                <div className="content">
                                    <h3 className="title">
                                    Regardez notre vidéo pour découvrir l'histoire de SMARTKIDS et voir comment notre plateforme peut booster votre visibilité à travers le monde!

                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default VideoPlayerHomeTwo;
