import React from 'react';
import useToggle from '../../Hooks/useToggle';
import Drawer from '../Mobile/Drawer';
import HeaderHomeTwo from '../HomeTwo/HeaderHomeTwo';
import FooterHomeTwo from '../HomeTwo/FooterHomeTwo';
import BackToTop from '../BackToTop';

function Cgu() {
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
                                    Conditions Générales d'Utilisation (CGU)
                                </h4>
                                <p>
                                    <span className="font-weight-bold mb-2">1. Objet</span>
                                    <br />
                                    Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités et conditions d'utilisation du site web et des services proposés par SMART KIDS (nom commercial de INS SOCIETY LLC).
                                    <br />
                                    <br />

                                    <span className="font-weight-bold mb-2">2. Accès au site</span>
                                    <br />
                                    L'accès et l'utilisation du site sont réservés à un usage strictement personnel. L'utilisateur s'engage à ne pas utiliser ce site à des fins illicites ou interdites.
                                    <br />
                                    <br />

                                    <span className="font-weight-bold mb-2">3. Responsabilité</span>
                                    <br />
                                    SMART KIDS ne peut être tenue responsable des dommages directs ou indirects résultant de l'utilisation du site.
                                    <br />
                                    <br />

                                    <span className="font-weight-bold mb-2">4. Propriété intellectuelle</span>
                                    <br />
                                    Tous les contenus du site sont la propriété exclusive de SMART KIDS. Toute reproduction est interdite sans autorisation préalable.                                    <br />
                                    <br />

                                    <span className="font-weight-bold mb-2">5. Données personnelles</span>
                                    <br />
                                    Les données collectées sont traitées conformément à notre Politique de Confidentialité.
                                    <br />
                                    <br />

                                    <span className="font-weight-bold mb-2">6. Modification des CGU</span>
                                    <br />
                                    SMART KIDS se réserve le droit de modifier les présentes CGU à tout moment.
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

export default Cgu;
