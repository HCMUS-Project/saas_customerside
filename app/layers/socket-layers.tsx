import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/hooks/store/auth.store";
import { useLanguage } from "@/hooks/use-language";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import io from "socket.io-client";

interface SocketLayerProps {
  children: React.ReactNode;
}

export default function SocketLayer({ children }: SocketLayerProps) {
  const toast = useToast();
  const authStore = useAuthStore();
  const pathName = usePathname();
  const lang = useLanguage();

  useEffect(() => {
    console.log(pathName);
  }, [pathName]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_NOTIFY_API ?? " ");
    socket.on(
      `booking-notify/${authStore.domain}/${authStore.email}`,

      (message) => {
        const status = message.type;
        const email = message.email;
        const service = message.service.name;

        console.log(message);
        toast.toast({
          title:
            status === "Created"
              ? lang.curLangPack?.rootDashboard?.["newBooking"]
              : status === "Cancel"
              ? lang.curLangPack?.rootDashboard?.["cancelBooking"]
              : "",
          description:
            status === "Created"
              ? `${email} ${lang.curLangPack?.rootDashboard?.["hasCreatedNewBookingOn"]} ${service}`
              : status === "Cancel"
              ? `${email} ${lang.curLangPack?.rootDashboard?.["hasCancelledBookingOn"]} ${service}`
              : "",
          variant:
            status === "Created"
              ? "success"
              : status === "Cancel"
              ? "destructive"
              : null,
        });
      }
    );

    socket.on(
      `e_commerce-notify/${authStore.domain}/${authStore.email}`,
      (message) => {
        console.log(message);
        const status = message.status;
        const email = message.email;

        toast.toast({
          title:
            status === "Created"
              ? lang.curLangPack?.rootDashboard?.["newOrder"]
              : status === "Cancel"
              ? lang.curLangPack?.rootDashboard?.["cancelOrder"]
              : "",
          description:
            status === "Created"
              ? `${email} ${lang.curLangPack?.rootDashboard?.["hasPlacedNewOrder"]}`
              : status === "Cancel"
              ? `${email} ${lang.curLangPack?.rootDashboard?.["hasCancelledOrder"]}`
              : "",
          variant:
            status === "Created"
              ? "success"
              : status === "Cancel"
              ? "destructive"
              : null,
        });
      }
    );
  }, [authStore.domain, authStore.email]);

  return children;
}
