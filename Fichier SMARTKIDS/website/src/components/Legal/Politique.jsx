import React from 'react';
import useToggle from '../../Hooks/useToggle';
import Drawer from '../Mobile/Drawer';
import HeaderHomeTwo from '../HomeTwo/HeaderHomeTwo';
import FooterHomeTwo from '../HomeTwo/FooterHomeTwo';
import BackToTop from '../BackToTop';

function Politique() {
    const [drawer, drawerAction] = useToggle(false);
    return (
        <>
            <Drawer drawer={drawer} action={drawerAction.toggle} />
            <HeaderHomeTwo action={drawerAction.toggle} />

            <section className={`appie-hero-area`}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12">
                            <div className="appie-hero-content">
                                <h4 className="appie-title" style={{ fontSize: 30 }}>
                                    Politique de Confidentialité
                                </h4>
                                <p>
                                    <span className="font-weight-bold mb-2">1. Collecte des données</span>
                                    <br />
                                    Nous collectons des informations personnelles dans le cadre de l'utilisation de notre site et de nos services.
                                    <br />
                                    <br />

                                    <span className="font-weight-bold mb-2">2. Utilisation des données</span>
                                    <br />
                                    Les données collectées sont utilisées pour la gestion des services, l'amélioration de l'expérience utilisateur et le respect des obligations légales.
                                    <br />
                                    <br />

                                    <span className="font-weight-bold mb-2">3. Protection des données</span>
                                    <br />
                                    Nous mettons en place des mesures de sécurité pour protéger les informations personnelles contre tout accès non autorisé.
                                    <br />
                                    <br />

                                    <span className="font-weight-bold mb-2">4. Droits des utilisateurs</span>
                                    <br />
                                    Conformément aux réglementations en vigueur, les utilisateurs disposent d'un droit d'accès, de rectification et de suppression de leurs données.
                                    <br />

                                    <span className="font-weight-bold mb-2">5. Contact</span>
                                    <br />
                                    Pour toute question relative à la protection des données, veuillez nous contacter à contact@smartkidsapp.com.
                                    <br />
                                    <br />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <FooterHomeTwo />
            <BackToTop className="back-to-top-2" />
        </>
    );
}

export default Politique;
