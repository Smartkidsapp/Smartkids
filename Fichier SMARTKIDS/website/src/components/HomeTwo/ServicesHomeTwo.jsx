import React from 'react';
import service1 from '../../assets/images/new/3.png';
import service2 from '../../assets/images/new/4.png';
import service3 from '../../assets/images/new/5.png';
import service4 from '../../assets/images/new/6.png';
import service5 from '../../assets/images/new/7.png';

function ServicesHomeTwo({ className }) {
    return (
        <>
            <section className={`appie-services-2-area pb-100 ${className}`} id="service">
                <div className="container">
                    <div className="row align-items-end">
                        <div className="col-lg-6 col-md-8">
                            {/*<div className="appie-section-title">
                                <h3 className="appie-title">Comment ça fonctionne</h3>
                                <p>
                                    L'application complète et intuitive pour découvrir des lieux adaptés aux enfants.
                                </p>
                            </div>*/}
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-4 col-md-6 text-center mt-5">
                            <img src={service1} alt="" style={{ width: '70%' }} />
                            <h4 className="title" style={{ color: "#654034", fontSize: 30, }}>Rapide et intuitif</h4>
                            <p class="mt-2" style={{ fontSize: 18 }}>
                                Trouvez les meilleurs lieux<br />
                                Kids-friendly en 1 dic
                            </p>
                        </div>
                        <div className="col-lg-4 col-md-6 text-center mt-5">
                            <img src={service2} alt="" style={{ width: '70%' }} />
                            <h4 className="title" style={{ color: "#654034", fontSize: 30, }}>Navigation fluide</h4>
                            <p class="mt-2" style={{ fontSize: 18 }}>
                                Accédez aux établissements<br />
                                à proximité ou à l'autre bout du monde<br />
                                en un rien de temps
                                Kids-friendly en 1 dic
                            </p>
                        </div>
                        <div className="col-lg-4 col-md-6 text-center mt-5">
                            <img src={service3} alt="" style={{ width: '70%' }} />
                            <h4 className="title" style={{ color: "#654034", fontSize: 30, }}>Sur-mesure</h4>
                            <p class="mt-2" style={{ fontSize: 18 }}>
                                Obtenez des suggestions adaptées<br />
                                à vos préférences <br />
                                et aux besoins de vos enfants
                            </p>
                        </div>
                        <div className="col-lg-4 col-md-6 text-center mt-5">
                            <img src={service4} alt="" style={{ width: '70%' }} />
                            <h4 className="title" style={{ color: "#654034", fontSize: 30, }}>Evaluations et avis</h4>
                            <p class="mt-2" style={{ fontSize: 18 }}>
                                Consultez les avis des utilisateurs <br />
                                pour faire votre choix
                            </p>
                        </div>
                        <div className="col-lg-4 col-md-6 text-center mt-5">
                            <img src={service5} alt="" style={{ width: '70%' }} />
                            <h4 className="title" style={{ color: "#654034", fontSize: 30, }}>Réservez facilement</h4>
                            <p class="mt-2" style={{ fontSize: 18 }}>
                                Réservez une activité <br />
                                ou un service en quelques secondes
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ServicesHomeTwo;
