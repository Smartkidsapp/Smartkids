import React from 'react';
import useToggle from '../../Hooks/useToggle';
import Drawer from '../Mobile/Drawer';
import HeaderHomeTwo from '../HomeTwo/HeaderHomeTwo';
import FooterHomeTwo from '../HomeTwo/FooterHomeTwo';
import BackToTop from '../BackToTop';

function Cgv() {
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
                                    Conditions Générales de Vente (CGV)
                                </h4>
                                <p>
                                    <span className="font-weight-bold mb-2">1. Champ d'application</span>
                                    <br />
                                    Les présentes CGV s'appliquent à toutes les ventes de services ou produits effectuées par SMART KIDS.
                                    <br />
                                    <br />

                                    <span className="font-weight-bold mb-2">2. Commandes</span>
                                    <br />
                                    Toute commande implique l'acceptation sans réserve des présentes conditions générales.
                                    <br />
                                    <br />

                                    <span className="font-weight-bold mb-2">3. Prix et paiement</span>
                                    <br />
                                    Les prix sont indiqués en USD et peuvent être modifiés sans préavis. Le paiement doit être effectué à la commande.
                                    <br />
                                    <br />

                                    <span className="font-weight-bold mb-2">4. Livraison</span>
                                    <br />
                                    Les services ou produits sont livrés dans les délais indiqués lors de la commande.
                                    <br />
                                    <br />

                                    <span className="font-weight-bold mb-2">5. Rétractation</span>
                                    <br />
                                    Le client dispose d'un délai de 14 jours pour exercer son droit de rétractation, sauf exceptions légales.
                                    <br />
                                    <br />

                                    <span className="font-weight-bold mb-2">6. Responsabilité</span>
                                    <br />
                                    SMART KIDS ne peut être tenue responsable des dommages résultant de l'utilisation de ses services ou produits.
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

export default Cgv;
