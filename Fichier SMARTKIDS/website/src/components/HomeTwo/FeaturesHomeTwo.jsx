import React from 'react';
import featureThumb from '../../assets/images/features-thumb-3.png';
import shape13 from '../../assets/images/shape/shape-13.png';
import shape14 from '../../assets/images/shape/shape-14.png';
import shape15 from '../../assets/images/shape/shape-15.png';

function FeaturesHomeTwo() {
    return (
        <>
            <section className="appie-features-area-2 pt-90 pb-100" id="features">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-12">
                            <div className="appie-section-title appie-section-title-2 text-center">
                                <h3 className="appie-title">
                                    Nous sommes là où vous  <br />
                                    en avez le plus besoin
                                </h3>
                                <p>
                                    L'application intuitive et bien pensée qui rend la vie de famille plus agréable et organisée.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-30 align-items-center">
                        <div className="col-lg-6">
                            <div className="appie-features-boxes">
                                <div className="appie-features-box-item">
                                    <h4 className="title">Bien intégré</h4>
                                    <p>Trouvez les meilleurs établissements pour enfants près de chez vous.</p>
                                </div>
                                <div className="appie-features-box-item item-2">
                                    <h4 className="title">Design épuré et moderne</h4>
                                    <p>Une navigation facile et un look agréable.</p>
                                </div>
                                <div className="appie-features-box-item item-3">
                                    <h4 className="title">Mode clair et sombre</h4>
                                    <p>Profitez d'une expérience personnalisée en fonction de votre préférence.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div
                                className="appie-features-thumb wow animated fadeInRight"
                                data-wow-duration="2000ms"
                                data-wow-delay="200ms"
                            >
                                <img src={featureThumb} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="features-shape-1">
                    <img src={shape15} alt="" />
                </div>
                <div className="features-shape-2">
                    <img src={shape14} alt="" />
                </div>
                <div className="features-shape-3">
                    <img src={shape13} alt="" />
                </div>
            </section>
        </>
    );
}

export default FeaturesHomeTwo;
