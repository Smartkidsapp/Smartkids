import React from 'react';
import Drawer from '../Mobile/Drawer';
import useToggle from '../../Hooks/useToggle';
import HeaderHomeTwo from '../HomeTwo/HeaderHomeTwo';
import FooterHomeTwo from '../HomeTwo/FooterHomeTwo';
import BackToTop from '../BackToTop';
import heroThumbOne from '../../assets/images/hero-thumb-one.png';
import heroThumbTwo from '../../assets/images/hero-thumb-two.png';

function Welcome() {
    const [drawer, drawerAction] = useToggle(false);
    return (
        <>
            <Drawer drawer={drawer} action={drawerAction.toggle} />
            <HeaderHomeTwo action={drawerAction.toggle} />

            <section className="register-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="contact-form">
                                <h4>🎉 Bienvenue dans la communauté SMARTKIDS ! 🎉</h4>
                                <p style={{margin: '0 0 15px', color: '#000'}}>Merci d'avoir inscrit votre établissement parmi les meilleurs lieux kids-friendly ! 🌟</p>
                                <p style={{margin: '0 0 15px', color: '#000'}}>📲 Téléchargez dès maintenant l'application SMARTKIDS pour :</p>
                                <ul>
                                    <li style={{color: '#000', margin: '0 0 15px'}}>- Gérer facilement les informations de votre établissement 📋</li>
                                    <li style={{color: '#000', margin: '0 0 15px'}}>- Suivre les avis et interactions avec les familles 👨‍👩‍👧‍👦</li>
                                </ul>
                                <p style={{margin: '0 0 15px', color: '#000'}}>🚀 Envie de plus de visibilité ? Promouvez votre établissement directement depuis l'application pour toucher encore plus de parents en quête de lieux adaptés pour leurs enfants ! 💼✨</p>
                                <div className="row"></div>
                                <div className="appie-hero-content">
                                    <ul>
                                        <li>
                                            <a href="#">
                                                <i className="fab fa-apple" /> Télécharger sur iOS
                                            </a>
                                        </li>
                                        <li>
                                            <a className="item-2" href="#">
                                                <i className="fab fa-google-play" /> Télécharger sur
                                                Android
                                            </a>
                                        </li>
                                    </ul>
                                </div>
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

export default Welcome;
