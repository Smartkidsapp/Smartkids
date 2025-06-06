import React from 'react';
import heroThumbOne from '../../assets/images/new/hero-thumb-one.png';
import heroThumbTwo from '../../assets/images/new/hero-thumb-two.png';
import shapeTwo from '../../assets/images/shape/shape-9.png';
import shapeThree from '../../assets/images/shape/shape-3.png';
import shapeFour from '../../assets/images/shape/shape-4.png';

function HeroHomeOne({ className }) {
    return (
        <>
            <section className={`appie-hero-area ${className || ''}`}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="appie-hero-content">
                                <span>Bienvenue sur SMARTKIDS</span>
                                <h1 className="appie-title">
                                    Trouvez les lieux kids-friendly en un clic avec SMARTKIDS !
                                </h1>
                                <p>
                                    Découvrez SMARTKIDS, l’application incontournable pour les parents et les familles ! La première plateforme mondiale à réunir en un seul endroit tous les lieux kids-friendly : parcs, restaurants, écoles, musées et bien plus encore. Embarquez pour des moments de qualité, où que vous soyez !
                                </p>
                                <ul>
                                    <li>
                                        <a href="https://apps.apple.com/us/app/smartkids/id6741917604">
                                            <i className="fab fa-apple" /> Télécharger sur iOS
                                        </a>
                                    </li>
                                    <li>
                                        <a className="item-2" href="https://play.google.com/store/apps/details?id=comm.app.smkids&hl=fr">
                                            <i className="fab fa-google-play" /> Télécharger sur
                                            Android
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="appie-hero-thumb">
                                <div
                                    className="thumb wow animated fadeInUp"
                                    data-wow-duration="2000ms"
                                    data-wow-delay="200ms"
                                >
                                    <img src={heroThumbOne} className="thum-img" alt="" />
                                </div>
                                <div
                                    className="thumb-2 wow animated fadeInRight"
                                    data-wow-duration="2000ms"
                                    data-wow-delay="600ms"
                                >
                                    <img src={heroThumbTwo} className="thum-img-1" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hero-shape-1">
                    <img src={shapeTwo} alt="" />
                </div>
                <div className="hero-shape-2">
                    <img src={shapeThree} alt="" />
                </div>
                <div className="hero-shape-3">
                    <img src={shapeFour} alt="" />
                </div>
            </section>
        </>
    );
}

export default HeroHomeOne;
