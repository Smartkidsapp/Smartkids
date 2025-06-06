import React from 'react';
import counterIconOne from '../../assets/images/icon/counter-icon-1.svg';
import counterIconTwo from '../../assets/images/icon/counter-icon-2.svg';
import counterIconThree from '../../assets/images/icon/counter-icon-3.svg';
import counterIconFour from '../../assets/images/icon/counter-icon-4.svg';
import CounterUpCom from '../../lib/CounterUpCom.jsx';
import icon1 from '../../assets/images/new/8.png';
import icon2 from '../../assets/images/new/9.png';
import icon3 from '../../assets/images/new/10.png';
import proprietaire from '../../assets/images/new/11.png';
import { Link } from 'react-router-dom';

function CounterArea({ style }) {
    return (
        <>
            <section className="appie-counter-area pt-90 pb-190" id="counter" style={style}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="appie-section-title">
                                <h3 className="appie-title">Smart Kids compte</h3>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 col-md-6">
                            <img src={icon1} alt="" style={{ width: '100%' }} />
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <img src={icon2} alt="" style={{ width: '100%' }} />
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <img src={icon3} alt="" style={{ width: '100%' }} />
                        </div>
                    </div>
                </div>
            </section>
            <section className="appie-counter-area pb-190" style={style}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 text-center">
                            <img src={proprietaire} alt="" style={{ width: '100%' }} />
                            <h4 style={{ fontSize: 30, marginTop: -80 }}>Vous etes propriétaire d'un établissement Kids Friendly?</h4>
                            <p className="mt-3" style={{ fontSize: 22 }}>Venez faire décourir votre lieu unique<br /> à des millions dutilisateurs</p>
                            <div className="appie-btn-box">
                                <Link to={'/proprietaire'} className="main-btn mt-4">
                                    Ajouter mon établissement
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default CounterArea;
