"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

import { registerSchema, type RegisterValues } from "@/lib/validation/auth";
import { fadeIn, scaleIn, staggerContainer } from "@/lib/animations/presets";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  User2,
  Mail,
  LockKeyhole,
  ArrowRight,
  Sparkles,
  Phone,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [codeValue, setCodeValue] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterValues) => {
    setServerError(null);
    setCodeError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setServerError(data?.message ?? "Kunne ikke sende verifiseringskode.");
        return;
      }

      setPendingEmail(values.email);
      setPendingName(values.name);
      setCodeValue("");
      setCodeModalOpen(true);
    } catch (error) {
      setServerError("Uventet feil. Prøv igjen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!pendingEmail) return;

    if (codeValue.trim().length !== 6) {
      setCodeError("Skriv inn koden på 6 sifre.");
      return;
    }

    setIsVerifyingCode(true);
    setCodeError(null);

    try {
      const res = await fetch("/api/auth/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingEmail,
          code: codeValue,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCodeError(data?.message ?? "Kunne ikke verifisere koden.");
        return;
      }

      setCodeModalOpen(false);
      router.push(
        `/login?message=${encodeURIComponent(
          "Registreringen er bekreftet. Logg inn."
        )}`
      );
    } catch (error) {
      setCodeError("Kunne ikke verifisere koden. Prøv igjen.");
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleResend = async () => {
    const values = getValues();
    setCodeError(null);
    setServerError(null);
    setIsResending(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCodeError(data?.message ?? "Kunne ikke sende ny kode.");
        return;
      }

      setPendingEmail(values.email);
      setPendingName(values.name);
      setCodeValue("");
    } catch (error) {
      setCodeError("Kunne ikke sende ny kode. Prøv igjen.");
    } finally {
      setIsResending(false);
    }
  };

  const handleModalChange = (open: boolean) => {
    setCodeModalOpen(open);
    if (!open) {
      setCodeValue("");
      setCodeError(null);
    }
  };

  return (
    <>
      <motion.div
        className="w-full max-w-md"
        variants={staggerContainer(0.06, 0.1)}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
          variants={fadeIn(0)}
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span>HamarTech Festivaluke</span>
        </motion.div>

        {/* Gradient frame + card */}
        <motion.div
          className="relative overflow-hidden rounded-[1.7rem] p-[2px]"
          variants={scaleIn(0.02)}
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[1.7rem] bg-[conic-gradient(from_0deg,#22E4FF,#5B5BFF,#F044FF,#22E4FF)] opacity-85 blur-[6px]"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            style={{ willChange: "transform" }}
          />

          <Card className="relative rounded-[1.6rem] border-border/70 bg-background shadow-[0_24px_70px_rgba(0,0,0,0.8)]">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-semibold md:text-3xl">
                Opprett konto
              </CardTitle>
              <CardDescription className="mt-2 text-sm text-muted-foreground md:text-[15px]">
                Lag en HamarTech-profil for å reservere plasser og lagre
                favorittarrangementer.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Navn */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    Navn
                  </label>
                  <div className="relative">
                    <User2 className="pointer-events-none absolute left-2 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-foreground/80" />
                    <Input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Ditt fulle navn"
                      className="pl-8"
                      aria-invalid={!!errors.name}
                      {...register("name")}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Telefon */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="phone"
                    className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    Telefon
                  </label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-2 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-foreground/80" />
                    <Input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+47 900 00 000"
                      className="pl-8"
                      aria-invalid={!!errors.phone}
                      {...register("phone")}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-destructive">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* E-post */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    E-post
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-2 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-foreground/80" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="din.epost@eksempel.no"
                      className="pl-8"
                      aria-invalid={!!errors.email}
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Passord */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    Passord
                  </label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-2 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-foreground/80" />
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Minst 8 tegn"
                      className="pl-8"
                      aria-invalid={!!errors.password}
                      {...register("password")}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Bekreft passord */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="confirmPassword"
                    className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    Bekreft passord
                  </label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-2 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-foreground/80" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Skriv passordet på nytt"
                      className="pl-8"
                      aria-invalid={!!errors.confirmPassword}
                      {...register("confirmPassword")}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Errors */}
                {serverError && (
                  <p className="text-xs text-destructive">{serverError}</p>
                )}

                <p className="text-[11px] text-muted-foreground md:text-xs">
                  Du får en kode på e-post for å bekrefte kontoen din.
                </p>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="mt-1 w-full justify-center border-0"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sender kode..." : "Send verifiseringskode"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col items-center gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground md:text-sm">
              <p>
                Har du allerede konto?{" "}
                <Link
                  href="/login"
                  className="text-foreground underline-offset-4 hover:text-primary hover:underline"
                >
                  Logg inn
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      <Dialog open={codeModalOpen} onOpenChange={handleModalChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bekreft e-postadressen</DialogTitle>
            <DialogDescription>
              Vi har sendt en 6-sifret kode til{" "}
              <span className="font-medium text-foreground">
                {pendingEmail ?? "e-posten din"}
              </span>
              . Skriv den inn for å bekrefte {pendingName ?? "kontoen"}.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3 mb-4 ml-auto mr-auto">
            <InputOTP
              maxLength={6}
              value={codeValue}
              onChange={(value) => {
                setCodeValue(value.replace(/\D/g, ""));
                setCodeError(null);
              }}
            >
              <InputOTPGroup className="w-full justify-between">
                {[0, 1, 2, 3, 4, 5].map((slot) => (
                  <InputOTPSlot key={slot} index={slot} />
                ))}
              </InputOTPGroup>
            </InputOTP>

            {codeError && (
              <p className="text-xs text-destructive">{codeError}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={isResending || isVerifyingCode}
            >
              {isResending ? "Sender..." : "Send ny kode"}
            </Button>
            <Button
              onClick={handleVerifyCode}
              disabled={codeValue.trim().length !== 6 || isVerifyingCode}
              className="border-0"
            >
              {isVerifyingCode ? "Verifiserer..." : "Bekreft kode"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
