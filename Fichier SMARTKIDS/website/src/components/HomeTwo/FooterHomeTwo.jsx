import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo-smartkids-removebg.png';

function FooterHomeTwo() {
    return (
        <>
            <section className="appie-footer-area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="footer-about-widget footer-about-widget-2">
                                <div className="logo">
                                    <a href="#">
                                        <img src={logo} alt="" style={{width: '40%'}} />
                                    </a>
                                </div>
                                <div className="social mt-30">
                                    <ul>
                                        <li>
                                            <a href="https://www.facebook.com/profile.php?id=61573160402756">
                                                <i className="fab fa-facebook-f" />
                                            </a>
                                        </li>
                                        {/*<li>
                                            <a href="#">
                                                <i className="fab fa-twitter" />
                                            </a>
                                        </li>*/}
                                        <li>
                                            <a href="https://www.instagram.com/smartkids.app/">
                                                <i className="fab fa-instagram" />
                                            </a>
                                        </li>
                                        {/*<li>
                                            <a href="#">
                                                <i className="fab fa-linkedin-in" />
                                            </a>
                                        </li>*/}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="footer-navigation footer-navigation-2">
                                <h4 className="title">Pages légales</h4>
                                <ul>
                                    <li>
                                        <Link to="/conditions-generales-d-utilisation">CGU</Link>
                                    </li>
                                    <li>
                                        <Link to="/conditions-generales-de-vente">CGV</Link>
                                    </li>
                                    <li>
                                        <Link to="/mentions-legales">Mentions légales</Link>
                                    </li>
                                    <li>
                                        <Link to="/politiques-de-confidentialites">Politique de confidentialité</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="footer-widget-info">
                                <h4 className="title">Contactez-nous</h4>
                                <ul>
                                    <li>
                                        <a href="#">
                                            <i className="fal fa-envelope" /> contact@smartkidsapp.com
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <i className="fal fa-map-marker-alt" /> Paris, France
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div
                                className="
                footer-copyright
                d-flex
                align-items-center
                justify-content-between
                pt-35
              "
                            >
                                <div className="apps-download-btn">
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
                                <div className="copyright-text">
                                    <p>Copyright © 2024 Smart Kids. All rights reserved.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default FooterHomeTwo;
