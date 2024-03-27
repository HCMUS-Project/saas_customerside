"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Destination = {
  value: string;
  label: string;
};

const Destinationes: Destination[] = [
  {
    value: "backlog",
    label: "Backlog",
  },
  {
    value: "todo",
    label: "Todo",
  },
  {
    value: "in progress",
    label: "In Progress",
  },
  {
    value: "done",
    label: "Done",
  },
  {
    value: "canceled",
    label: "Canceled",
  },
];

export function ComboBoxResponsiveDestination() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedDestination, setSelectedDestination] =
    React.useState<Destination | null>(null);

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedDestination ? (
              <>{selectedDestination.label}</>
            ) : (
              <>+ Set Destination</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <DestinationList
            setOpen={setOpen}
            setSelectedDestination={setSelectedDestination}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedDestination ? (
            <>{selectedDestination.label}</>
          ) : (
            <>+ Set Destination</>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <DestinationList
            setOpen={setOpen}
            setSelectedDestination={setSelectedDestination}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function DestinationList({
  setOpen,
  setSelectedDestination,
}: {
  setOpen: (open: boolean) => void;
  setSelectedDestination: (Destination: Destination | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter Destination..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Destinationes.map((Destination) => (
            <CommandItem
              key={Destination.value}
              value={Destination.value}
              onSelect={(value) => {
                setSelectedDestination(
                  Destinationes.find((priority) => priority.value === value) ||
                    null
                );
                setOpen(false);
              }}
            >
              {Destination.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
