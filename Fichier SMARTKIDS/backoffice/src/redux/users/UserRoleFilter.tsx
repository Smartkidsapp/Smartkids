import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserRoleEnum } from "@/types/user.types";
import { CommandList } from "cmdk";

const roles = [
  {
    value: UserRoleEnum.CLIENT,
    label: "Client",
  },
  {
    value: UserRoleEnum.DRIVER,
    label: "Chauffeur",
  },
];

export function UserRoleFilter({
  onChange,
  value,
}: {
  value?: UserRoleEnum;
  onChange: (value: UserRoleEnum) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? roles.find((role) => role.value === value)?.label
            : "Filtrer par role..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Chercher un role..." />
          <CommandList>
            <CommandEmpty>Aucun role trouvé.</CommandEmpty>
            <CommandGroup>
              {roles.map((role) => (
                <CommandItem
                  key={role.label}
                  value={role.label}
                  onSelect={(currentValue) => {
                    if (currentValue === role.value) {
                      onChange(currentValue);
                    }

                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === role.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {role.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
