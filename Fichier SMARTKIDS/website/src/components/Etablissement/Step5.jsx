import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import EtbsLocationForm from './EtbsLocationForm';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const Step5 = ({ onChangeIndex, handleBack }) => {

    const { createEtablissement } = useSelector((state) => state.auth);

    const [adresse, setAdresse] = useState('');

    return (
        <Container>
            <Row className="mt-4">
                <Col md={8}>
                    <h3 className="mb-3">Où est situé votre établissement ?</h3>
                    <EtbsLocationForm value={adresse} onChangeLocation={setAdresse} />
                </Col>
            </Row>
            <Row className="mt-5">
                <div className="col-6 col-md-6 d-flex align-items-center justify-content-start">
                    <div style={{cursor: 'pointer'}} onClick={handleBack}>
                        Retour
                    </div>
                </div>
                <div className="col-6 appie-btn-box col-md-6 text-right">
                    <button className="main-btn" onClick={onChangeIndex} disabled={!createEtablissement?.longitude}>
                        Suivant
                    </button>
                </div>
            </Row>
        </Container>
    );
};

export default Step5;