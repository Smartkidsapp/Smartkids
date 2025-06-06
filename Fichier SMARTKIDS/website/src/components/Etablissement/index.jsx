import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Drawer from '../Mobile/Drawer';
import useToggle from '../../Hooks/useToggle';
import HeaderHomeTwo from '../HomeTwo/HeaderHomeTwo';
import FooterHomeTwo from '../HomeTwo/FooterHomeTwo';
import BackToTop from '../BackToTop';
import { useGetCategoriesQuery, useGetProfileQuery, useLazyGetProfileQuery } from '../../features/user/userApiSlice';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';
import SubscriptionPage from './SubscriptionPage';
import { Col, Container, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Etablissement() {

    const { isLoading: isLoadingUser, isError, error, isSuccess, data: user } = useGetProfileQuery();

    const navigation = useNavigate();

    const [drawer, drawerAction] = useToggle(false);
    const [currentIndex, setCurrentIndex] = useState(1);

    const { data, isLoading } = useGetCategoriesQuery();

    const handlPress = async () => {
        if (currentIndex < 8) {
            const index = currentIndex + 1;
            setCurrentIndex(index);
        }
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Smooth scroll to top
        });
    }

    const handleBack = () => {
        if (currentIndex == 1) {
            //navigation.goBack()
        } else {
            const index = currentIndex - 1;
            setCurrentIndex(index);
        }
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Smooth scroll to top
        });
    }

    useEffect(() => {
        if(isError) {
            console.log(error);
            navigation('/login', { replace: true });
        }
    }, [isError]);

    useEffect(() => {
        if(isSuccess) {
            if(user.data && user.data.isSeller) {
                navigation('/welcome', { replace: true });
            }
        }
    }, [isSuccess]);

    const Step = useMemo(() => {
        switch (currentIndex) {
            case 1:
                return <Step1 onChangeIndex={handlPress} handleBack={handleBack} />;
            case 2:
                return <Step2 onChangeIndex={handlPress} handleBack={handleBack} />;
            case 3:
                return <Step3 onChangeIndex={handlPress} handleBack={handleBack} />;
            case 4:
                return <Step4 onChangeIndex={handlPress} handleBack={handleBack} />;
            case 5:
                return <Step5 onChangeIndex={handlPress} handleBack={handleBack} />;
            case 6:
                return <Step6 onChangeIndex={handlPress} handleBack={handleBack} />;
            case 7:
                return <SubscriptionPage onChangeIndex={handlPress} handleBack={handleBack} />;
            default:
                return null;
        }
    }, [currentIndex, handlPress, handleBack]);

    return (
        <>
            <Drawer drawer={drawer} action={drawerAction.toggle} />
            <HeaderHomeTwo action={drawerAction.toggle} />
            <section className="register-section" style={{ padding: '100px 0' }}>
                <Container className="my-4">
                    <Row>
                        {[1, 2, 3, 4, 5, 6, 7].map((item, index) => (
                            <Col key={item} style={{ padding: 0 }}>
                                <div
                                    className="progress-segment"
                                    style={{ height: '5px', width: '100%', backgroundColor: `${currentIndex > index ? '#E5D7C5' : '#1E1E1E'}` }}
                                ></div>
                            </Col>
                        ))}
                    </Row>
                </Container>
                {Step}
            </section>
            <FooterHomeTwo />
            <BackToTop className="back-to-top-2" />
        </>
    );
}

export default Etablissement;
