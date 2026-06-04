import React, { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import { Download, MapPin, Calendar, Clock, User, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Ticket as TicketType } from "@/lib/tickets";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface TicketProps {
  ticket: TicketType;
  passengerName: string;
}

const Ticket: React.FC<TicketProps> = ({ ticket, passengerName }) => {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const formattedDate = new Date(ticket.created_at).toLocaleDateString("en-NG", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedTime = new Date(ticket.created_at).toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    setIsDownloading(true);

    try {
      // Small timeout to allow styling/rendering to settle
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const canvas = await html2canvas(ticketRef.current, {
        scale: 3, // High quality scale for mobile gallery clarity
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#064e3b", // Deep emerald color matching card background
        logging: false,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `arewa-trip-ticket-${ticket.id.slice(0, 8)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Ticket saved to gallery",
        description: "Your digital boarding pass has been downloaded successfully.",
      });
    } catch (error) {
      console.error("[ticket] Download error:", error);
      toast({
        title: "Download failed",
        description: "Could not save your ticket as an image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 sm:p-6 w-full max-w-md mx-auto">
      {/* Visual Ticket Body */}
      <div
        ref={ticketRef}
        id="arewa-trip-ticket-card"
        className="w-full bg-gradient-to-br from-emerald-800 to-green-950 text-white rounded-3xl overflow-hidden shadow-2xl border border-emerald-600/30 flex flex-col"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Ticket Header */}
        <div className="p-6 pb-4 bg-emerald-900/60 border-b border-emerald-700/30 flex justify-between items-center">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-300">Arewa Trips</h4>
            <h3 className="text-lg font-extrabold text-white mt-0.5">GROUP RIDE TICKET</h3>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-300">VALID</span>
          </div>
        </div>

        {/* Ticket Route Banner */}
        <div className="px-6 py-4 bg-emerald-950/40 flex items-center justify-between gap-4 border-b border-dashed border-emerald-700/40 relative">
          {/* Half-circles on left/right for boarding pass notch effect */}
          <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-8 bg-card rounded-r-full border-r border-y border-emerald-600/30" />
          <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-8 bg-card rounded-l-full border-l border-y border-emerald-600/30" />
          
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">From</span>
            <p className="font-extrabold text-white text-base truncate">{ticket.origin}</p>
          </div>
          <div className="flex flex-col items-center shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <div className="w-10 h-0.5 border-t border-dashed border-emerald-600 my-1.5" />
            <div className="w-2.5 h-2.5 rounded-full border-2 border-emerald-400 bg-transparent" />
          </div>
          <div className="flex-1 min-w-0 text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">To</span>
            <p className="font-extrabold text-white text-base truncate">{ticket.destination}</p>
          </div>
        </div>

        {/* Ticket Info Section */}
        <div className="p-6 space-y-5 flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2.5">
              <User className="w-4.5 h-4.5 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] text-emerald-300 uppercase font-medium">Passenger</span>
                <p className="text-sm font-bold text-white truncate max-w-[140px]">{passengerName}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] text-emerald-300 uppercase font-medium">Reference</span>
                <p className="text-sm font-bold text-white font-mono">{ticket.id.slice(0, 8).toUpperCase()}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4.5 h-4.5 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] text-emerald-300 uppercase font-medium">Date</span>
                <p className="text-sm font-bold text-white">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4.5 h-4.5 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] text-emerald-300 uppercase font-medium">Time</span>
                <p className="text-sm font-bold text-white">{formattedTime}</p>
              </div>
            </div>
          </div>

          {/* QR Code Divider / Dashboard QR Frame */}
          <div className="pt-5 border-t border-dashed border-emerald-700/50 flex flex-col items-center">
            <div className="bg-white p-3 rounded-2xl shadow-inner border-2 border-emerald-500/20 mb-3 flex items-center justify-center">
              <QRCodeSVG
                value={ticket.id}
                size={140}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: "/favicon.ico", // Attempt to include small brand favicon if exists
                  x: undefined,
                  y: undefined,
                  height: 24,
                  width: 24,
                  excavate: true,
                }}
              />
            </div>
            <span className="text-[10px] text-emerald-300 font-medium tracking-wide uppercase">
              Scan for Boarding Verification
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <Button
        onClick={handleDownload}
        disabled={isDownloading}
        className="w-full py-6 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition-all active:scale-[0.98]"
      >
        <Download className={`w-5 h-5 ${isDownloading ? "animate-bounce" : ""}`} />
        {isDownloading ? "Saving to Gallery..." : "Download Ticket"}
      </Button>
    </div>
  );
};

export default Ticket;
