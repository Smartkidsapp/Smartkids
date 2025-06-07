import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useGetEtablissementByUserQuery, useGetEtablissementQuery } from "@/redux/etablissement/etblissement.apiSlice";
import CarouselSlider from "@/components/CarouselSlider";
import { MapPin, Phone, Wifi } from "lucide-react";

export default function Etablissement({ id }: { id: string }) {
  const { data, isFetching } = useGetEtablissementQuery(id);

  if (isFetching || !data) {
    return (
      <Card>
        <CardContent>
          <Skeleton className="h-[500px]" />
        </CardContent>
      </Card>
    );
  }

  const etablissement = data.data;

  return (
    <div className="grid gap-4">
      <h3 className={"text-2xl font-semibold leading-none tracking-tight"}>
        Etablissement
      </h3>
      {
        etablissement && (
          <Card className="overflow-hidden">
            <CardContent className="p-6 text-sm">
              <div className="flex flex-col items-center justify-center w-[100%]">
                <CarouselSlider images={etablissement.images} />
                <div className="flex flex-col mt-5 items-start justify-center w-[80%]">
                  <span className="font-weight-bold" style={{ fontSize: 18, fontWeight: 'bold' }}>{etablissement.nom}</span>
                  <span className="text-md mt-3">{etablissement.category.titre}</span>
                  <div className="flex flex-row items-center justify-start mt-3 gap-1">
                    <MapPin size={16} />
                    <span className="text-md">{etablissement.adresse}</span>
                  </div>
                  <div className="flex flex-row items-center justify-start mt-3 gap-1">
                    <Phone size={16} />
                    <span className="text-md">{etablissement.phone}</span>
                  </div>
                  <Separator className="my-3" />
                  <span className="font-weight-bold" style={{ fontSize: 16, fontWeight: 'bold' }}>Description</span>
                  <span className="text-md mt-3">{etablissement.description}</span>
                  {
                    etablissement.options.length > 0 && (
                      <>
                        <Separator className="my-3" />
                        <span className="font-weight-bold" style={{ fontSize: 16, fontWeight: 'bold' }}>Ce que propose nom de l’établissement</span>
                        <ul>
                          {
                            etablissement.options.map((option, key) => (
                              <div className="flex flex-row items-center justify-start gap-2 mt-3">
                                <span className="text-md">{option.titre}</span>
                              </div>
                            ))
                          }
                        </ul>
                      </>
                    )
                  }
                  {
                    (etablissement.services && etablissement.services.length > 0) && (
                      <>
                        <Separator className="my-3" />
                        <span className="font-weight-bold" style={{ fontSize: 16, fontWeight: 'bold' }}>Services de l'établissement</span>
                        <ul className="w-[100%]">
                          {
                            etablissement.services.map((service, key) => (
                              <div className="flex flex-row items-center justify-between gap-2 mt-3">
                                <span className="text-md">{service.title}</span>
                                <span className="text-md">{service.price}</span>
                              </div>
                            ))
                          }
                        </ul>
                      </>
                    )
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }
    </div>
  );
}
