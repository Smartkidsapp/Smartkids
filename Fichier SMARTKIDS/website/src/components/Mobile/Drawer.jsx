import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo-smartkids.png';

function Drawer({ drawer, action, lang }) {
    const [itemSize, setSize] = useState('0px');
    const [item, setItem] = useState('home');
    const handler = (e, value) => {
        // e.preventDefault();
        const getItems = document.querySelectorAll(`#${value} li`).length;
        if (getItems > 0) {
            setSize(`${43 * getItems}px`);
            setItem(value);
        }
    };
    return (
        <>
            {lang ? (
                <>
                    <div
                        onClick={(e) => action(e)}
                        className={`off_canvars_overlay ${drawer ? 'active' : ''}`}
                    ></div>
                    <div className="offcanvas_menu">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div
                                        className={`offcanvas_menu_wrapper ${drawer ? 'active' : ''
                                            }`}
                                    >
                                        <div className="canvas_close">
                                            <a href="#" onClick={(e) => action(e)}>
                                                <i className="fa fa-times"></i>
                                            </a>
                                        </div>
                                        <div className="offcanvas-brand text-center mb-40">
                                            <img src={logo} style={{ width: 100 }} alt="" />
                                        </div>
                                        <div id="menu" className="text-left ">
                                            <div className="appie-btn-box text-right">
                                                <Link to={'/register'} className="main-btn">
                                                    Ajouter mon établissement
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="offcanvas-social">
                                            <ul className="text-center">
                                                <li>
                                                    <a href="#">
                                                        <i className="fab fa-facebook-f"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fab fa-twitter"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fab fa-instagram"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fab fa-linkedin-in" />
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="footer-widget-info">
                                            <ul>
                                                <li>
                                                    <a href="#">
                                                        <i className="fal fa-envelope"></i>{' '}
                                                        contact@smartkidsapp.com
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fal fa-map-marker-alt"></i>{' '}
                                                        Paris, France
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div
                        onClick={(e) => action(e)}
                        className={`off_canvars_overlay ${drawer ? 'active' : ''}`}
                    ></div>
                    <div className="offcanvas_menu">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div
                                        className={`offcanvas_menu_wrapper ${drawer ? 'active' : ''
                                            }`}
                                    >
                                        <div className="canvas_close">
                                            <a href="#" onClick={(e) => action(e)}>
                                                <i className="fa fa-times"></i>
                                            </a>
                                        </div>
                                        <div className="offcanvas-brand text-center mb-40">
                                            <img src={logo} style={{ width: 100 }} alt="" />
                                        </div>
                                        <div id="menu" className="text-left ">
                                            <div className="appie-btn-box text-right">
                                                <Link to={'/register'} className="main-btn">
                                                    Ajouter mon établissement
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="offcanvas-social">
                                            <ul className="text-center">
                                                <li>
                                                    <a href="$">
                                                        <i className="fab fa-facebook-f"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="$">
                                                        <i className="fab fa-twitter"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="$">
                                                        <i className="fab fa-instagram"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="$">
                                                        <i className="fab fa-linkedin-in" />
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="footer-widget-info">
                                            <ul>
                                                <li>
                                                    <a href="#">
                                                        <i className="fal fa-envelope"></i>{' '}
                                                        contact@smartkidsapp.com
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fal fa-map-marker-alt"></i>{' '}
                                                        Paris, France
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default Drawer;
