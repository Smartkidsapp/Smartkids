import React, { useEffect } from 'react';
import logo from '../../assets/images/logo-smartkids.png';
import StickyMenu from '../../lib/StickyMenu.js';
import Navigation from '../Navigation.jsx';
import { useLazyGetProfileQuery } from '../../features/user/userApiSlice';
import { Link } from 'react-router-dom';

function HeaderHomeTwo({ action }) {
    const [triggerGetProfile] = useLazyGetProfileQuery();

    useEffect(() => {
        StickyMenu();
    }, []);

    const handleClickUser = async (e) => {
        try {
            const result = await triggerGetProfile().unwrap();
            console.log('Profil récupéré :', result);
        } catch (err) {
            console.error('Erreur récupération profil :', err);
        }
    };

    return (
        <header className="appie-header-area appie-header-2-area appie-sticky">
            <div className="container">
                <div className="header-nav-box">
                    <div className="row align-items-center">
                        <div className="col-lg-2 col-md-4 col-sm-5 col-6 order-1 order-sm-1">
                            <div className="appie-logo-box">
                                <Link to={"/"}>
                                    <img style={{ width: '50%' }} src={logo} alt="" />
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-1 col-sm-1 order-3 order-sm-2">
                            {/* Navigation désactivée */}
                        </div>
                        <div className="col-lg-4 col-md-7 col-sm-6 col-6 order-2 order-sm-3">
                            <div className="appie-btn-box text-right d-flex align-items-center justify-content-end gap-3">
                                <Link to={'/register'} className="main-btn ml-30">
                                    Ajouter mon établissement
                                </Link>

                                {/* Lien vers /account avec icône utilisateur */}
                                <Link
                                    to="/account"
                                    onClick={handleClickUser}
                                    title="Mon compte"
                                    style={{ marginLeft: '12px', display: 'flex', alignItems: 'center' }}
                                >
                                    <i className="fa fa-user" style={{ fontSize: '20px', color: '#333' }}></i>
                                </Link>

                                <div
                                    onClick={(e) => action(e)}
                                    className="toggle-btn ml-30 canvas_open d-lg-none d-block"
                                >
                                    <i className="fa fa-bars" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default HeaderHomeTwo;
