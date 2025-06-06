import React from 'react';
import aboutThumb from '../../assets/images/etablissement.png';

function AboutHomeTwo() {
    return (
        <>
            <section className="appie-about-area mb-100">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div
                                className="appie-about-box wow animated fadeInUp"
                                data-wow-duration="2000ms"
                                data-wow-delay="200ms"
                            >
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="about-thumb">
                                            <img src={aboutThumb} alt="" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="appie-about-content">
                                            <h3 className="title">
                                                Faites bonne impression avec SMARTKIDS.
                                            </h3>
                                            <p>
                                                Attirez l'attention des parents et présentez votre établissement aux familles de manière efficace.
                                            </p>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="appie-about-service mt-30">
                                                    <div className="icon">
                                                        <i className="fal fa-check" />
                                                    </div>
                                                    <h4 className="title">Description soignée</h4>
                                                    <p>
                                                        Partagez votre histoire, vos valeurs, et ce qui rend votre établissement unique.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="appie-about-service mt-30">
                                                    <div className="icon">
                                                        <i className="fal fa-check" />
                                                    </div>
                                                    <h4 className="title">Choix dans l'application</h4>
                                                    <p>
                                                        Votre établissement aura sa place parmi les meilleures options pour les familles.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default AboutHomeTwo;
