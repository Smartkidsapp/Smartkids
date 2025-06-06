import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useCreateEtablissementMutation } from '../../features/user/userApiSlice';
import { setCreateEtablissement } from '../../features/user/userSlice';

function Step6({
    onChangeIndex,
    handleBack
}) {

    const { createEtablissement } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const [addEtablisement, { isLoading, isError, isSuccess, error, data }] = useCreateEtablissementMutation();

    const [images, setImages] = useState([]);
    const [files, setFiles] = useState([]);

    const fileInputRef = useRef(null);

    const handleRemoveImage = (id) => {
        setImages(images.filter((image) => image.id !== id));
    };

    const handleAddImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            const newId = images.length + 1;
            const newImageUrl = URL.createObjectURL(file);
            setImages([...images, { id: newId, url: newImageUrl }]);
            setFiles((prevImages) => [...prevImages, file]);
        }
    };

    const openFilePicker = () => {
        fileInputRef.current.click();
    };

    const onSubmit = () => {
        if (files && files.length > 0) {
            addEtablisement({...createEtablissement, images: files});
        }
    };

    useEffect(() => {
        if(isSuccess) {
            onChangeIndex();
        }
        if(isError) {
            console.log(error);
        }
    }, [isSuccess, isError])

    return (
        <Container>
            <h3 className="mb-4">Ajouter quelques images de votre établissement</h3>
            <Row className="mt-3">
                {images.map((image) => (
                    <Col key={image.id} xs={6} md={4} className="mb-3">
                        <Card className="position-relative" style={{ borderRadius: '9px', height: 250 }}>
                            <Card.Img variant="top" src={image.url} style={{ borderRadius: '8px', height: '100%', objectFit: 'cover' }} />
                            <div
                                onClick={() => handleRemoveImage(image.id)}
                                style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
                            >
                                <i className="fa fa-times-circle text-danger" style={{ fontSize: 22 }}></i>
                            </div>
                        </Card>
                    </Col>
                ))}
                {
                    images.length < 10 && (
                        <Col xs={6} md={4} className="mb-3">
                            <Card
                                className="d-flex align-items-center justify-content-center"
                                style={{ height: 250, border: '2px dashed #E5D7C5', borderRadius: '8px', cursor: 'pointer' }}
                                onClick={openFilePicker}
                            >
                                <Card.Body className="text-center d-flex flex-column align-items-center justify-content-center">
                                    <i className="fa fa-image" style={{ fontSize: '32px', color: '#E5D7C5' }}></i>
                                    <p>Cliquez pour ajouter</p>
                                </Card.Body>
                            </Card>
                            <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleAddImage}
                            />
                        </Col>
                    )
                }
            </Row>
            <Row className="mt-5">
                <div className="col-6 col-md-6 d-flex align-items-center justify-content-start">
                    <div style={{cursor: 'pointer'}} onClick={handleBack}>
                        Retour
                    </div>
                </div>
                <div className="col-6 appie-btn-box col-md-6 text-right">
                    <button className="main-btn" onClick={onSubmit} disabled={images.length < 1 || isLoading}>
                        Suivant
                    </button>
                </div>
            </Row>
        </Container>
    );
}

export default Step6;
