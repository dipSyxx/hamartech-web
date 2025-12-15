"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

import { loginSchema, type LoginValues } from "@/lib/validation/auth";
import {
  fadeIn,
  scaleIn,
  staggerContainer,
} from "@/lib/animations/presets";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Mail, LockKeyhole, ArrowRight, Sparkles } from "lucide-react";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Placeholder submit handler – replace with real auth later
  const onSubmit = (values: LoginValues) => {
    console.log("Login submit (stub):", values);
  };

  return (
    <motion.div
      className="w-full max-w-md"
      variants={staggerContainer(0.06, 0.1)}
      initial="hidden"
      animate="visible"
    >
      {/* Маленький надпис / контекст */}
      <motion.div
        className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
        variants={fadeIn(0)}
      >
        <Sparkles className="h-4 w-4 text-primary" />
        <span>HamarTech · Festivaluke</span>
      </motion.div>

      {/* Gradient frame + card */}
      <motion.div
        className="relative overflow-hidden rounded-[1.7rem] p-[2px]"
        variants={scaleIn(0.02)}
      >
        {/* Анімований градієнтний бордер */}
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
              Logg inn
            </CardTitle>
            <CardDescription className="mt-2 text-sm text-muted-foreground md:text-[15px]">
              Få oversikt over dine reservasjoner og billetter til HamarTech-uka.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* E-post */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                >
                  E-post
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                  <LockKeyhole className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
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

              {/* Допоміжний рядок: забув пароль / інфо */}
              <div className="flex items-center justify-between text-[11px] text-muted-foreground md:text-xs">
                <span>Vi sender deg ingen spam.</span>
                <Link
                  href="#"
                  className="text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
                >
                  Glemt passord?
                </Link>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="mt-1 w-full justify-center"
              >
                Logg inn
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col items-center gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground md:text-sm">
            <p>
              Har du ikke konto ennå?{" "}
              <Link
                href="/auth/register"
                className="text-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                Registrer deg
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}
