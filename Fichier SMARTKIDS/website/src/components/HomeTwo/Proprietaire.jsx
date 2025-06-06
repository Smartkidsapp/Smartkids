import React from 'react';
import useToggle from '../../Hooks/useToggle.js';
import BackToTop from '../BackToTop.jsx';
import Drawer from '../Mobile/Drawer.jsx';
import AboutHomeTwo from './AboutHomeTwo.jsx';
import CounterArea from './CounterArea.jsx';
import DownloadHomeTwo from './DownloadHomeTwo.jsx';
import FeaturesHomeTwo from './FeaturesHomeTwo.jsx';
import FooterHomeTwo from './FooterHomeTwo.jsx';
import HeaderHomeTwo from './HeaderHomeTwo.jsx';
import HeroHomeTwo from './HeroHomeTwo.jsx';
import PricingHomeTwo from './PricingHomeTwo.jsx';
import VideoPlayerHomeTwo from './VideoPlayerHomeTwo.jsx';

function Proprietaire() {
    const [drawer, drawerAction] = useToggle(false);
    return (
        <>
            <Drawer drawer={drawer} action={drawerAction.toggle} />
            <HeaderHomeTwo action={drawerAction.toggle} />
            <VideoPlayerHomeTwo />
            <PricingHomeTwo />
            <FooterHomeTwo />
            <BackToTop className="back-to-top-2" />
        </>
    );
}

export default Proprietaire;
