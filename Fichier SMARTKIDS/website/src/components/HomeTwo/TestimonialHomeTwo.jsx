import React, { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import testmonialUser from '../../assets/images/testimonial-user-1.png';

function TestimonialHomeTwo() {
    const sliderRef = useRef();
    const sliderNext = () => {
        sliderRef.current.slickNext();
    };
    const sliderPrev = () => {
        sliderRef.current.slickPrev();
    };
    const settings = {
        autoplay: true,
        arrows: false,
        dots: false,
    };
    return (
        <>
            <section className="appie-testimonial-2-area mb-90" id="testimonial">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="appie-testimonial-2-box">
                                <div
                                    className="appie-testimonial-slider-2"
                                    style={{ position: 'relative' }}
                                >
                                    <span
                                        onClick={sliderPrev}
                                        className="prev slick-arrow"
                                        style={{ display: 'block' }}
                                    >
                                        <i className="fal fa-arrow-left" />
                                    </span>
                                    <Slider ref={sliderRef} {...settings}>
                                        <div className="appie-testimonial-slider-2-item">
                                            <div className="item">
                                                <div className="thumb">
                                                    <img src={testmonialUser} alt="" />
                                                    <ul>
                                                        <li>
                                                            <i className="fas fa-star" />
                                                        </li>
                                                        <li>
                                                            <i className="fas fa-star" />
                                                        </li>
                                                        <li>
                                                            <i className="fas fa-star" />
                                                        </li>
                                                        <li>
                                                            <i className="fas fa-star" />
                                                        </li>
                                                        <li>
                                                            <i className="fas fa-star" />
                                                        </li>
                                                    </ul>
                                                    <span>(4.7) review</span>
                                                </div>
                                                <div className="content">
                                                    <p>
                                                        SMARTKIDS  est devenu indispensable pour moi. Elle me fait gagner un temps fou en me montrant directement les endroits kids friendly. J'adore pouvoir filtrer selon les activités et l’âge de mes enfants. Je recommande vivement !
                                                    </p>
                                                    <div className="author-info">
                                                        <h5 className="title">Caroline</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="appie-testimonial-slider-2-item">
                                            <div className="item">
                                                <div className="thumb">
                                                    <img src={testmonialUser} alt="" />
                                                    <ul>
                                                        <li>
                                                            <i className="fas fa-star" />
                                                        </li>
                                                        <li>
                                                            <i className="fas fa-star" />
                                                        </li>
                                                        <li>
                                                            <i className="fas fa-star" />
                                                        </li>
                                                        <li>
                                                            <i className="fas fa-star" />
                                                        </li>
                                                        <li>
                                                            <i className="fas fa-star" />
                                                        </li>
                                                    </ul>
                                                    <span>(4.7) review</span>
                                                </div>
                                                <div className="content">
                                                    <p>
                                                        Application très bien pensée ! Les lieux sont bien classés, et il y a même des avis et des photos. Parfait pour trouver des idées de sorties adaptées à toute la famille. Je la recommande à tous les parents.
                                                    </p>
                                                    <div className="author-info">
                                                        <h5 className="title">Linda</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="appie-testimonial-slider-2-item">
                                            <div className="item">
                                                <div className="thumb">
                                                    <img src={testmonialUser} alt="" />
                                                    <ul>
                                                        <li>
                                                            <i className="fas fa-star" />
                                                        </li>
                                                        <li>
                                                            <i className="fas fa-star" />
                                                        </li>
                                                        <li>
                                                            <i className="fas fa-star" />
                                                        </li>
                                                        <li>
                                                            <i className="fas fa-star" />
                                                        </li>
                                                        <li>
                                                            <i className="fas fa-star" />
                                                        </li>
                                                    </ul>
                                                    <span>(4.7) review</span>
                                                </div>
                                                <div className="content">
                                                    <p>
                                                        En voyage, cette application est parfaite pour trouver les lieux adaptés aux enfants dans chaque ville. Plus besoin de chercher pendant des heures, tout est là ! Une vraie pépite pour les parents voyageurs.
                                                    </p>
                                                    <div className="author-info">
                                                        <h5 className="title">Carla</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="appie-testimonial-slider-2-item">
                                            <div className="item">
                                                <div className="thumb">
                                                    <img src={testmonialUser} alt="" />
                                                    <ul>
                                                        <li>
                                                            <i className="fas fa-star" />
                                                        </li>
                                                        <li>
                                                            <i className="fas fa-star" />
                                                        </li>
                                                        <li>
                                                            <i className="fas fa-star" />
                                                        </li>
                                                        <li>
                                                            <i className="fas fa-star" />
                                                        </li>
                                                        <li>
                                                            <i className="fas fa-star" />
                                                        </li>
                                                    </ul>
                                                    <span>(4.7) review</span>
                                                </div>
                                                <div className="content">
                                                    <p>
                                                        On a découvert de nouveaux endroits incroyables grâce à cette appli ! Nos week-ends n’ont jamais été aussi bien remplis.
                                                    </p>
                                                    <div className="author-info">
                                                        <h5 className="title">Lilli</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Slider>
                                    <span
                                        onClick={sliderNext}
                                        className="next slick-arrow"
                                        style={{ display: 'block' }}
                                    >
                                        <i className="fal fa-arrow-right" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default TestimonialHomeTwo;
