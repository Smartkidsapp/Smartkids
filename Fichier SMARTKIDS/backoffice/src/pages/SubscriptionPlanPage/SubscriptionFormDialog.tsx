import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubscriptionPlan } from "@/types/susbcription-plan.types";
import React, { useState } from "react";
import SubscriptionPlanForm from "./SubscriptionPlanForm";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";

export default function SubscriptionFormDialog({
  subscriptionPlan,
  btnTitle,
}: {
  subscriptionPlan?: SubscriptionPlan;
  btnTitle?: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="flex gap-3"
          variant="outline"
          onClick={() => setIsOpen(true)}
        >
          {btnTitle ?? null}
          <Pen className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className={"lg:max-w-screen-lg overflow-y-scroll max-h-screen"}
      >
        <DialogHeader>
          <DialogTitle>
            {subscriptionPlan ? "Mettre à jour le plan" : "Ajouter un plan"}
          </DialogTitle>

          <SubscriptionPlanForm
            onSuccess={() => setIsOpen(false)}
            subscriptionPlan={subscriptionPlan}
            key={subscriptionPlan?.id ?? "new"}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
