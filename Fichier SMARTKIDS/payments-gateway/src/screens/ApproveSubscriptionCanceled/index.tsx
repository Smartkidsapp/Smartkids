export default function ApproveSubscriptionCanceled() {
  return (
    <div className="centered-container">
      <div>
        <p
          style={{
            fontWeight: 500,
            fontSize: "14px",
            textAlign: "center",
            color: "rgba(8, 33, 45, 1)",
          }}
        >
          Paiement annulé.
        </p>
        <p
          style={{
            fontWeight: 500,
            color: "rgba(8, 33, 45, .5)",
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          La confirmation de l'abonnement a été annulée.
        </p>
      </div>
    </div>
  );
}
