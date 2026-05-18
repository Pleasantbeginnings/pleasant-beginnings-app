import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ExternalLink, Copy, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DonateModalProps {
  open: boolean;
  onClose: () => void;
}

const DONATION_METHODS = [
  {
    id: "paypal",
    label: "PayPal",
    description: "Donate securely online",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 5.025-5.993 5.025H12.4c-.524 0-.968.382-1.05.9l-.974 6.17-.274 1.731a.421.421 0 0 0 .416.487h2.92c.458 0 .85-.334.922-.785l.038-.196.731-4.64.047-.256a.932.932 0 0 1 .922-.785h.581c3.76 0 6.703-1.528 7.561-5.95.36-1.847.174-3.388-.643-4.414z"/>
      </svg>
    ),
    href: "https://www.paypal.com/donate/?hosted_button_id=PLACEHOLDER",
    color: "text-[#003087]",
    bg: "bg-[#003087]/5 hover:bg-[#003087]/10 border-[#003087]/20",
    cta: "Donate via PayPal",
    external: true,
  },
  {
    id: "cashapp",
    label: "Cash App",
    description: "Quick mobile giving",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M23.59 3.48A5 5 0 0 0 20.52.41L13.4 0l-1.75 1.74L9.9 0 2.78.41A5 5 0 0 0-.29 3.48L0 10.6l1.74 1.75L0 14.1l.41 7.12A5 5 0 0 0 3.48 24.3l7.12.41 1.75-1.74 1.75 1.74 7.12-.41a5 5 0 0 0 3.07-3.07l.41-7.12-1.74-1.75 1.74-1.75zM14.5 18.12l-.77 2.38a.37.37 0 0 1-.34.25h-2.78a.37.37 0 0 1-.34-.25l-.77-2.38a8.9 8.9 0 0 1-2.72-1.12l-2.43.58a.37.37 0 0 1-.4-.16L2.9 15.06a.37.37 0 0 1 .04-.43l1.73-1.97a9 9 0 0 1 0-3.14L2.94 7.55a.37.37 0 0 1-.04-.43l1.05-1.36a.37.37 0 0 1 .4-.16l2.43.58A8.9 8.9 0 0 1 9.5 5.06l.77-2.38a.37.37 0 0 1 .34-.25h2.78a.37.37 0 0 1 .34.25l.77 2.38a8.9 8.9 0 0 1 2.72 1.12l2.43-.58a.37.37 0 0 1 .4.16l1.05 1.36a.37.37 0 0 1 .04.43l-1.73 1.97a9 9 0 0 1 0 3.14l1.73 1.97a.37.37 0 0 1 .04.43l-1.05 1.36a.37.37 0 0 1-.4.16l-2.43-.58a8.9 8.9 0 0 1-2.72 1.13z"/>
      </svg>
    ),
    cashtag: "$PleasantBeginnings",
    color: "text-[#00D64F]",
    bg: "bg-[#00D64F]/5 hover:bg-[#00D64F]/10 border-[#00D64F]/20",
    cta: "Copy $Cashtag",
    external: false,
  },
  {
    id: "zelle",
    label: "Zelle",
    description: "Bank-to-bank transfer",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.25 16.5H9.375l5.625-9H8.25V6h8.625l-5.625 9H18v1.5z"/>
      </svg>
    ),
    zelleInfo: "Admin@pleasantbeginnings.info",
    color: "text-[#6D1ED4]",
    bg: "bg-[#6D1ED4]/5 hover:bg-[#6D1ED4]/10 border-[#6D1ED4]/20",
    cta: "Copy Email for Zelle",
    external: false,
  },
  {
    id: "check",
    label: "Check or Money Order",
    description: "Mail your contribution",
    icon: <Mail className="w-6 h-6" />,
    payableTo: "Pleasant Beginnings Inc.",
    note: "Mail to: Baltimore, MD — contact us for mailing address",
    color: "text-primary",
    bg: "bg-primary/5 hover:bg-primary/10 border-primary/20",
    cta: "Get Mailing Address",
    external: false,
    mailTo: true,
  },
];

export function DonateModal({ open, onClose }: DonateModalProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="donate-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            key="donate-modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-background rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-primary px-8 pt-8 pb-6 relative">
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-secondary fill-secondary" />
                </div>
                <span className="text-secondary text-sm font-semibold uppercase tracking-widest">Support Our Mission</span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-white mb-2">Make a Donation</h2>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">
                Pleasant Beginnings Inc. is a registered 501(c)(3) nonprofit. Your contribution is
                <span className="text-secondary font-semibold"> tax-deductible</span> to the extent permitted by law.
              </p>
              <p className="text-primary-foreground/50 text-xs mt-2">EIN: 86-2300371</p>
            </div>

            {/* Donation methods */}
            <div className="p-6 space-y-3">
              {DONATION_METHODS.map((method) => (
                <div
                  key={method.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${method.bg}`}
                  onClick={() => {
                    if (method.external && method.href) {
                      window.open(method.href, "_blank", "noopener,noreferrer");
                    } else if (method.id === "cashapp" && method.cashtag) {
                      handleCopy(method.cashtag, method.id);
                    } else if (method.id === "zelle" && method.zelleInfo) {
                      handleCopy(method.zelleInfo, method.id);
                    } else if (method.mailTo) {
                      window.location.href = "mailto:Admin@pleasantbeginnings.info?subject=Donation%20Mailing%20Address";
                    }
                  }}
                >
                  <div className={`shrink-0 ${method.color}`}>{method.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{method.label}</p>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                    {method.cashtag && (
                      <p className="text-xs font-mono text-foreground/60 mt-0.5">{method.cashtag}</p>
                    )}
                    {method.zelleInfo && (
                      <p className="text-xs font-mono text-foreground/60 mt-0.5">{method.zelleInfo}</p>
                    )}
                    {method.payableTo && (
                      <p className="text-xs text-foreground/60 mt-0.5">Payable to: <span className="font-semibold">{method.payableTo}</span></p>
                    )}
                  </div>
                  <div className={`shrink-0 ${method.color}`}>
                    {method.external ? (
                      <ExternalLink className="w-4 h-4" />
                    ) : copied === method.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : method.mailTo ? (
                      <ExternalLink className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 text-center">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Questions about your donation? Contact us at{" "}
                <a href="mailto:Admin@pleasantbeginnings.info" className="text-secondary hover:underline">
                  Admin@pleasantbeginnings.info
                </a>{" "}
                or call{" "}
                <a href="tel:4106379113" className="text-secondary hover:underline">(410) 637-9113</a>.
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 text-muted-foreground hover:text-foreground"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
