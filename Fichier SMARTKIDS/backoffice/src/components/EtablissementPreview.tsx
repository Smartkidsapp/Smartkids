import { User } from "@/types/user.types";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { AvatarImage } from "./ui/avatar";
import avatarImg from "@/assets/images/avatar.png";
import { initial } from "@/lib/utils";
import UserEmail from "./UserEmail";
import StarWidget from "./StarWidget";
import { Link } from "react-router-dom";
import { Etablissement } from "@/types/etablissement";

export default function EtablissementPreview({ etablissement }: { etablissement: Etablissement }) {
    return (
        <Link to={`/etablissements/${etablissement.id}?name=${etablissement.nom}`}>
            <div className="flex items-center gap-2">
                {
                    etablissement.images.length > 0 ?
                    <img src={etablissement.images[0].src} style={{height: 100, width: 100, objectFit: 'cover'}} alt={etablissement.nom} />
                    :
                    <div style={{height: 100, width: 100, backgroundColor: '#eeeeee'}}></div>
                }
                <div>
                    <div>{etablissement.nom}</div>
                    <div className="flex  gap-2 items-center text-sm text-muted-foreground">
                        <span>{etablissement.phone}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
