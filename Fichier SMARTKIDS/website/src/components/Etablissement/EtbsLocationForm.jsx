import React, { useState, useEffect, Fragment } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { useLazySearchPlaceQuery } from '../../features/user/userApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateEtablissement } from '../../features/user/userSlice';

function EtbsLocationForm ({ label, value, onChangeLocation }) {

    const { createEtablissement } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const [showList, setShowList] = useState(false);
    const [query, setQuery] = useState('');
    const [triggerSearch, { data, error, isLoading }] = useLazySearchPlaceQuery();

    useEffect(() => {
        console.log(data);
        if (query.length > 3) {
            setShowList(true);
            triggerSearch({ query });
        } else {
            setShowList(false);
            triggerSearch({ query: '' });
        }
    }, [query]);

    const handleSelectAdresse = (adresse) => {
        dispatch(setCreateEtablissement({ adresse: adresse.name, latitude: adresse.lat, longitude: adresse.lng }));
        onChangeLocation(adresse.name);
        setShowList(false);
    };

    return (
        <Fragment>
            <Form.Group className="contact-form">
                <InputGroup className="mb-3">
                    <InputGroup.Text>
                        <i className="me-2 fa fa-map-marked-alt" style={{ fontSize: 20 }} />
                    </InputGroup.Text>
                    <Form.Control
                        placeholder="Indiquer l’adresse de votre établissement"
                        value={value}
                        onChange={(e) => { setQuery(e.target.value); onChangeLocation(e.target.value); }}
                    />
                </InputGroup>
                {showList && (
                    <div className="position-relative">
                        <div className="list-group mt-2" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                            {
                                (!data || data?.data.length === 0) ? (
                                    <div className="list-group-item d-flex align-items-center">
                                        <i className="me-2 fa fa-info-circle" style={{ fontSize: 20 }} />
                                        <span>Aucun résultat</span>
                                    </div>
                                ) : (
                                    data?.data.map((adresse, key) => (
                                        <button
                                            key={key}
                                            className="list-group-item list-group-item-action d-flex align-items-center"
                                            onClick={() => handleSelectAdresse(adresse)}
                                        >
                                            <div>
                                                <div>{adresse.name}</div>
                                                <small className="text-muted">{adresse.formatted_address}</small>
                                            </div>
                                        </button>
                                    ))
                                )
                            }
                        </div>
                    </div>
                )}
            </Form.Group>
        </Fragment>
    );
};

export default EtbsLocationForm;