import React from 'react';
import shape13 from '../../assets/images/shape/shape-13.png';
import shape14 from '../../assets/images/shape/shape-14.png';
import shape15 from '../../assets/images/shape/shape-15.png';

function DownloadHomeTwo({ className }) {
    return (
        <>
            <section className={`appie-download-area pt-150 pb-160 mb-90 ${className || ''}`}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5">
                            <div className="appie-download-content">
                                <span>Télécharger l'application</span>
                                <h3 className="title">
                                    Disponible sur <br />
                                    l'App Store et Google Play
                                </h3>
                                <p>
                                    Téléchargez SMARTKIDS pour découvrir les meilleurs endroits pour vos enfants à tout moment, où que vous soyez !
                                </p>
                                <ul>
                                    <li>
                                        <a href="#">
                                            <i className="fab fa-apple" />
                                            <span>
                                                Télécharger sur <span>iOS</span>
                                            </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="item-2" href="#">
                                            <i className="fab fa-google-play" />
                                            <span>
                                                Télécharger sur <span>Android</span>
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="download-shape-1">
                    <img src={shape15} alt="" />
                </div>
                <div className="download-shape-2">
                    <img src={shape14} alt="" />
                </div>
                <div className="download-shape-3">
                    <img src={shape13} alt="" />
                </div>
            </section>
        </>
    );
}

export default DownloadHomeTwo;
