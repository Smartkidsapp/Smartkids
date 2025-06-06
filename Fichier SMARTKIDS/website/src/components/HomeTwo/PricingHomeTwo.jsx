import React, { useState } from 'react';
import { useListPlansQuery } from '../../features/user/userApiSlice';
import { formatCurrency, formatSubscriptionReccurence } from '../Etablissement/SubscriptionPage';
import { Link } from 'react-router-dom';
import priceBg from '../../assets/images/new/prices.png';

function PricingHomeTwo() {
    const [toggleSwitch, setSwitchValue] = useState(true);
    const handleSwitch = (e) => {
        e.preventDefault();
        setSwitchValue(!toggleSwitch);
    };

    const { data } = useListPlansQuery();
    const plans = data?.data ?? [];

    return (
        <>
            <section className="appie-pricing-2-area pb-100">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="appie-section-title text-center">
                                <h3 className="appie-title">Tarification simple pour tous</h3>
                                <p>
                                    Découvrez nos différentes offres sans engagement, adaptées à vos besoins et à petits prix !
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="tab-content" id="pills-tabContent">
                                <div
                                    className={`tab-pane fade ${toggleSwitch ? 'active show' : ''}`}
                                    id="pills-home"
                                    role="tabpanel"
                                    aria-labelledby="pills-home-tab"
                                >
                                    <div className="row justify-content-center">
                                        {plans.map((plan) => (

                                            <div className="col-lg-4 col-md-6 text-center">
                                                <div style={{ backgroundImage: `url(${priceBg})`, width: '100%', height: 300, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                                                    <h4 className="text-white text-center" style={{ fontSize: 24 }}>Forfait <br />"{plan.name}"</h4>
                                                </div>
                                                <h4 style={{ fontSize: 30, marginTop: 15 }}>{formatCurrency(plan.price)}/{" "} {formatSubscriptionReccurence(plan.interval_unit, plan.interval_count)}</h4>
                                                <p className="mt-3" style={{ fontSize: 18, lineHeight: 1.8 }}>{plan.description}</p>
                                                <div className="appie-btn-box mt-3">
                                                    <Link className="main-btn" to={'/register'}>
                                                        Ajouter mon établissement
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
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

export default PricingHomeTwo;
