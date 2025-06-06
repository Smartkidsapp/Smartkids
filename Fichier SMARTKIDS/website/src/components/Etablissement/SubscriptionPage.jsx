import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import '../../assets/css/subscription-page.css';
import { useGetSubscriptionStatusQuery, useListPlansQuery, usePaySubscriptionMutation } from '../../features/user/userApiSlice';
import SubscriptionPriceBreakdown from './SubscriptionPriceBreakdown';
import StripePaymentMethods from './StripePaymentMethods';
import creditCard from '../../assets/images/credit-card.svg';
import { Link, useNavigate } from "react-router-dom";
import StripePaymentMethodForm from './StripePaymentMethodForm';

function SubscriptionPage({
    onChangeIndex,
    handleBack
}) {
    const [accessToken, setAccessToken] = useState();
    
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);

    const { data: subscriptionStatus, isLoading: isLoadingStatus } = useGetSubscriptionStatusQuery(undefined, {
      refetchOnFocus: true,
    });

    const currentPlanId =
      typeof subscriptionStatus?.data?.subscription?.plan === "string"
        ? subscriptionStatus?.data?.subscription?.plan
        : subscriptionStatus?.data?.subscription?.plan?.id;

    const [request, { isLoading }] = usePaySubscriptionMutation();

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const { data } = useListPlansQuery();
    const plans = data?.data ?? [];

    const [selectedPlan, setSelectedPlan] = useState();

    const [paymentMethod, setPaymentMethod] = useState();
    const [plan, setPlan] = useState();
    const planChanged = !currentPlanId || selectedPlan !== currentPlanId;

    const handlePlanChange = (event) => {
        setSelectedPlan(event.target.value);
    };

    useEffect(() => {
        let localAccessToken = localStorage.getItem("access_token");
        if (localAccessToken) {
            setAccessToken(localAccessToken);
        }
    }, []);

    useEffect(() => {
        if (currentPlanId) {
          const pl = plans.find((p) => p.id === currentPlanId);
          console.log(pl);
          setSelectedPlan(pl.id);
        }
    }, [plans, currentPlanId]);

    useEffect(() => {
        const filterPlans = plans.filter((p) => p.id == selectedPlan);
        if (filterPlans) {
            setPlan(filterPlans[0]);
        }
    }, [selectedPlan]);

    const subscribe = () => {
      if (!selectedPlan || !paymentMethod) {
        return;
      }
  
      request({
        paymentMethod: paymentMethod?.value,
        paymentMethodType: paymentMethod?.type,
        planId: selectedPlan,
        changePlan: planChanged,
        subscriptionId: subscriptionStatus?.data?.subscription?.id,
      }).then((res) => {
        if ("data" in res && res.data) {
          navigate("/welcome");
        }
  
        if ("error" in res) {
        }
      });
    };

    return (
        <Container className="subscription-page">
            <h3 className="mb-4">Opter pour un abonnement a fin de bénéficier d’une visibilité</h3>
            <Row className="mt-3">
                <Col xs={12} md={8} lg={6}>
                    <Form>
                        <div className="subscription-options">
                            {plans.map((plan) => (
                                <Card
                                    className={`subscription-card ${selectedPlan === plan.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedPlan(plan.id)}
                                >
                                    <Card.Body>
                                        <Form.Check
                                            type="radio"
                                            label={plan.name}
                                            value={plan.id}
                                            name="subscription"
                                            checked={selectedPlan === plan.id}
                                            onChange={handlePlanChange}
                                        />
                                        <p className="plan-description">{plan.description}</p>
                                        <strong>
                                            {formatCurrency(plan.price)} /{" "}
                                            {formatSubscriptionReccurence(
                                                plan.interval_unit,
                                                plan.interval_count
                                            )}
                                        </strong>
                                    </Card.Body>
                                </Card>
                            ))}

                            {/*<Card
                                className={`subscription-card ${selectedPlan === 'Standard' ? 'selected' : ''}`}
                                onClick={() => setSelectedPlan('Standard')}
                            >
                                <Card.Body>
                                    <Form.Check
                                        type="radio"
                                        label="Standard"
                                        value="Standard"
                                        name="subscription"
                                        checked={selectedPlan === 'Standard'}
                                        onChange={handlePlanChange}
                                    />
                                    <p className="plan-description">Le lorem ipsum est, en</p>
                                    <strong>12 € / mois</strong>
                                </Card.Body>
                            </Card>

                            <Card
                                className={`subscription-card ${selectedPlan === 'Premium' ? 'selected' : ''}`}
                                onClick={() => setSelectedPlan('Premium')}
                            >
                                <Card.Body>
                                    <Form.Check
                                        type="radio"
                                        label="Premium"
                                        value="Premium"
                                        name="subscription"
                                        checked={selectedPlan === 'Premium'}
                                        onChange={handlePlanChange}
                                    />
                                    <p className="plan-description">Le lorem ipsum est, en</p>
                                    <strong>99 € / année</strong>
                                </Card.Body>
                            </Card>*/}
                        </div>
                    </Form>

                    {plan && <hr />}

                    {
                        plan && (
                            <SubscriptionPriceBreakdown plan={plan} />
                        )
                    }

                    <hr />

                    <h6>Méthode de paiement</h6>
                    <p className="payment-method-description mt-2">
                    Sécurité et simplicité : Optez pour nos méthodes de paiement faciles. Payez en toute confiance avec notre gamme d'options sûres et pratiques pour des transactions fluides et sécurisées.
                    </p>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <div className="d-flex align-items-center" style={{ gap: 10 }}>
                            <img src={creditCard} style={{ height: 15 }} />
                            <span className="m-0">
                                Carte de crédit
                            </span>
                        </div>
                        <Button className="btn btn-light btn-sm" onClick={() => window.open(`https://payments-gateway.smartkidsapp.com/stripe-web?token=${accessToken}&redirect_status=no`, "_blank")}>
                            <i className="fa fa-plus"></i>
                        </Button>
                    </div>

                    <StripePaymentMethods
                        onMethodSelected={(method) => {
                            setPaymentMethod(method);
                        }}
                        selectedMethod={paymentMethod?.value}
                    />
                </Col>
            </Row>
            <Row className="mt-5">
                <div className="col-md-6 col-6 text-left">
                    <div className="appie-btn-box">
                        <button className="main-btn" onClick={subscribe} disabled={isLoading}>
                            Payer
                        </button>
                    </div>
                </div>
                <div className="col-md-6 col-6 d-flex align-items-center justify-content-end">
                    <Link to={"/welcome"} className="" style={{color: "#000"}}>
                        Plus tard
                    </Link>
                </div>
            </Row>

            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header closeButton={true}>
                    <Modal.Title>Payment Method</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <StripePaymentMethodForm />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default SubscriptionPage;

const priceFmt = new Intl.NumberFormat("fr-FR", {
    currency: "EUR",
    style: "currency",
});

export function formatCurrency(price) {
    return priceFmt.format(price);
}

export const formatSubscriptionReccurence = (
    unit,
    count,
    style
) => {
    let text;
    switch (unit) {
        case "day":
            text = count === 1 ? "jour" : `${count} jours`;
            break;
        case "week":
            text = count === 1 ? "semaine" : `${count} semaines`;
            break;
        case "month":
            text = count === 1 ? "mois" : `${count} mois`;
            break;
        case "year":
            text = count === 1 ? "an" : `${count} ans`;
            break;
    }

    if (style === "long" && count > 1) {
        text = `chaque ${text}`;
    } else if (style === "short" && count > 1) {
        text = `par ${text}`;
    }

    return text;
};