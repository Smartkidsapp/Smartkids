import React, { useEffect, useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import Drawer from '../Mobile/Drawer';
import HeaderHomeTwo from '../HomeTwo/HeaderHomeTwo';
import FooterHomeTwo from '../HomeTwo/FooterHomeTwo';
import useToggle from '../../Hooks/useToggle';
import BackToTop from '../BackToTop';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useVerifyEmailMutation } from '../../features/user/userApiSlice';

function VerifyEmail() {
    const [drawer, drawerAction] = useToggle(false);

    const location = useLocation();

    const navigate = useNavigate();

    let email = location.state.email;
    let token = location.state.token;

    const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
    const [code, setCode] = useState(['', '', '', '', '', '']);

    const handleChange = (value, index) => {
        if (/^[0-9]?$/.test(value)) { // Allow only numeric input
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            // Move to the next input field automatically if a digit is entered
            if (value && index < code.length - 1) {
                document.getElementById(`code-${index + 1}`).focus();
            }
        }
    };

    const onSubmit = (data) => {
        const codeValue = code.join('');

        if (!codeValue || codeValue.length !== 6) {
            return;
        }

        verifyEmail({
            email: email,
            otp: codeValue,
            type: 'evf',
            token: token,
        }).then(res => {
            if ('data' in res && res.data) {
                navigate("/etablissement")
            }

            if ('error' in res && res.error) {
                alert('Le code est incorrecte');
            }
        });
    };
    
    return (
        <>
            <Drawer drawer={drawer} action={drawerAction.toggle} />
            <HeaderHomeTwo action={drawerAction.toggle} />
            <section className="register-section">
                <Container className="mt-5">
                    <h2 className="mb-3">Confirmation</h2>
                    <p className="text-muted my-3">
                        Merci de saisir le code de vérification envoyé via votre mail pour assurer la sécurité de votre compte.
                    </p>
                    <div>
                        <Row>
                            <Col md={5}>
                                <Row className="mb-4 justify-content-center align-items-center">
                                    {code.map((value, index) => (
                                        <Col key={index} xs={2}>
                                            <Form.Control
                                                type="text"
                                                maxLength="1"
                                                id={`code-${index}`}
                                                value={value}
                                                onChange={(e) => handleChange(e.target.value, index)}
                                                style={{ textAlign: 'center', fontSize: '1.5rem', borderRadius: '0.5rem', border: '1px solid #ccc' }}
                                            />
                                        </Col>
                                    ))}
                                    <div className="col-md-12 mt-4">
                                        <div className="appie-btn-box">
                                            <button type="button" onClick={onSubmit} disabled={isLoading} className="main-btn">
                                                Confirmer
                                            </button>
                                        </div>
                                    </div>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </section>
            <FooterHomeTwo />
            <BackToTop className="back-to-top-2" />
        </>
    );
}

export default VerifyEmail;
