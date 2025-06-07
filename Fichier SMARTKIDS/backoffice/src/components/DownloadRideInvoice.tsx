import config from "@/config";
import { useGetRideInvoiceQuery } from "@/redux/rides/ride.apiSlice";
import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Download } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Card } from "./ui/card";

export default function DownloadRideInvoice({ rideId }: { rideId: string }) {
  const { data, isFetching } = useGetRideInvoiceQuery(rideId);

  if (isFetching || !data) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <NavLink
          target="_blank"
          to={`${config.serverUrl}/api/v1/invoices/${data.data.payment.number}/download`}
        >
          <Download className="h-5 w-5" />
        </NavLink>
      </TooltipTrigger>
      <TooltipContent>
        <Card className="p-3">Télécharger la facture</Card>
      </TooltipContent>
    </Tooltip>
  );
}
