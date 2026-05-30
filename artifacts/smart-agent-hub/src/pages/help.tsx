import { useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaTelegram, FaWhatsapp } from "react-icons/fa6";
import { Mail, Copy, Check, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactCards = [
  {
    icon: <Mail size={22} />,
    title: "Email",
    value: "support@smartagenthub.io",
    href: "mailto:support@smartagenthub.io",
    copyable: true,
    color: "from-violet-500/10 to-purple-500/10 border-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    icon: <FaTelegram size={22} />,
    title: "Telegram",
    value: "@SmartAgentHub",
    href: "https://t.me/SmartAgentHub",
    copyable: false,
    color: "from-sky-500/10 to-blue-500/10 border-sky-500/20",
    iconColor: "text-sky-400",
  },
  {
    icon: <FaWhatsapp size={22} />,
    title: "WhatsApp",
    value: "+1 (555) 000-0000",
    href: "https://wa.me/15550000000",
    copyable: false,
    color: "from-green-500/10 to-emerald-500/10 border-green-500/20",
    iconColor: "text-green-400",
  },
  {
    icon: <FaGithub size={22} />,
    title: "GitHub",
    value: "github.com/SmartAgentHub",
    href: "https://github.com",
    copyable: false,
    color: "from-zinc-500/10 to-slate-500/10 border-zinc-500/20",
    iconColor: "text-zinc-300",
  },
];

function ContactCard({ card, index }: { card: typeof contactCards[0]; index: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    await navigator.clipboard.writeText(card.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.a
      href={card.href}
      target={card.href.startsWith("mailto") ? undefined : "_blank"}
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
      className={`block p-6 rounded-2xl bg-gradient-to-br ${card.color} backdrop-blur-sm border hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer`}
      data-testid={`card-contact-${card.title.toLowerCase()}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${card.iconColor}`}>{card.icon}</div>
        {card.copyable && (
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            data-testid={`button-copy-${card.title.toLowerCase()}`}
            aria-label="Copy to clipboard"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
        )}
      </div>
      <p className="text-foreground font-semibold text-base mb-1">{card.title}</p>
      <p className="text-muted-foreground text-sm">{card.value}</p>
    </motion.a>
  );
}

export default function HelpPage() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = (data: ContactFormData) => {
    console.log("Form data:", data);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="text-center mb-14"
      >
        <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Support</p>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4">Help & Contact</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Choose your preferred channel or send a message directly.
        </p>
      </motion.div>

      {/* Contact cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
        {contactCards.map((card, i) => (
          <ContactCard key={card.title} card={card} index={i} />
        ))}
      </div>

      {/* Contact form */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.35, ease: "easeOut" }}
        className="rounded-3xl bg-card/50 backdrop-blur-sm border border-white/8 p-8 sm:p-10"
      >
        <h2 className="text-2xl font-bold text-foreground mb-2">Send a Message</h2>
        <p className="text-muted-foreground text-sm mb-8">Fill out the form and we'll get back to you shortly.</p>

        {submitted ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Check size={24} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Message Received</h3>
            <p className="text-muted-foreground">Thanks for reaching out. We'll be in touch soon.</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 text-sm font-medium">Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your name"
                          className="bg-background/50 border-white/10 focus:border-primary/40"
                          data-testid="input-name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 text-sm font-medium">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          className="bg-background/50 border-white/10 focus:border-primary/40"
                          data-testid="input-email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80 text-sm font-medium">Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger
                          className="bg-background/50 border-white/10 focus:border-primary/40"
                          data-testid="select-subject"
                        >
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="bug">Bug Report</SelectItem>
                        <SelectItem value="product">Product Inquiry</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80 text-sm font-medium">Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us how we can help..."
                        rows={5}
                        className="bg-background/50 border-white/10 focus:border-primary/40 resize-none"
                        data-testid="input-message"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-xl shadow-primary/20 group"
                data-testid="button-submit-contact"
              >
                <Send size={15} className="group-hover:translate-x-0.5 transition-transform" />
                Send Message
              </button>
            </form>
          </Form>
        )}
      </motion.div>
    </div>
  );
}
