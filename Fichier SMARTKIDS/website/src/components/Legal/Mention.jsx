import React from 'react';
import useToggle from '../../Hooks/useToggle';
import Drawer from '../Mobile/Drawer';
import HeaderHomeTwo from '../HomeTwo/HeaderHomeTwo';
import FooterHomeTwo from '../HomeTwo/FooterHomeTwo';
import BackToTop from '../BackToTop';

function Mention() {
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
                                <h4 className="appie-title" style={{fontSize: 30}}>
                                    Mentions Légales
                                </h4>
                                <p>
                                    <span className="font-weight-bold mb-2">1. Éditeur du site</span>
                                    <br/>
                                    SMART KIDS (nom commercial de INS SOCIETY LLC)
                                    30 N Gould St Ste N, Sheridan, WY 82801, United States.
                                    <br/>
                                    <br/>

                                    <span className="font-weight-bold mb-2">2. Directeur de la publication</span>
                                    <br/>
                                    SMART KIDS
                                    <br/>
                                    <br/>

                                    <span className="font-weight-bold mb-2">3. Hébergeur du site</span>
                                    <br/>
                                    Hostinger
                                    <br/>
                                    <br/>

                                    <span className="font-weight-bold mb-2">4. Contact</span>
                                    <br/>
                                    Email : contact@smartkidsapp.com
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

export default Mention;
