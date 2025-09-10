// @ts-nocheck 
 "use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormData, FormSchema } from "@/schemas/formSchema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover as _Popover } from "@/components/ui/popover";

export function FormComponent() {
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    mode: "onTouched",
  });

  const steps: string[] = ["Applicant", "Documents", "Review & Submit"];

  const stepFields: string[][] = [
    ["firstName", "lastName", "dateOfBirth"],
    ["email", "citizenshipCertificate"],
    ["agreeToDeclaration"],
  ];

  const formatSingleDate = (d?: Date) => (d ? d.toISOString().slice(0, 10) : "Select date");

  function hasErrorAt(path: string): boolean {
    const parts = path.split(".");
    let current: unknown = form.formState.errors;
    for (const p of parts) {
      if (typeof current !== "object" || current === null) return false;
      const obj = current as Record<string, unknown>;
      if (!(p in obj)) return false;
      current = obj[p];
      if (current && typeof current === "object") {
        const maybe = current as Record<string, unknown>;
        if ("message" in maybe) return true;
      }
    }
    return false;
  }

  const goNext = async () => {
    const target = stepFields[step] ?? [];
    const valid = await form.trigger(target as any);
    if (valid) setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);
    try {
      console.log("Citizenship application payload:", {
        ...values,
        citizenshipCertificate: values.citizenshipCertificate ? {
          name: values.citizenshipCertificate[0]?.name,
          type: values.citizenshipCertificate[0]?.type,
          size: values.citizenshipCertificate[0]?.size,
        } : null,
      });
      await new Promise((r) => setTimeout(r, 800));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="grid gap-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Citizenship Certificate Application</h2>
          <div className="text-sm text-muted-foreground">Step {step + 1} of {steps.length}: {steps[step]}</div>
        </div>

        {step === 0 && (
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input placeholder="Given name" {...field} aria-invalid={hasErrorAt(field.name)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input placeholder="Family name" {...field} aria-invalid={hasErrorAt(field.name)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button type="button" variant="outline" className="justify-start font-normal" aria-invalid={hasErrorAt(field.name)}>
                          {formatSingleDate(field.value)}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(d) => {
                          if (d) field.onChange(d);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} aria-invalid={hasErrorAt(field.name)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="citizenshipCertificate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="citizenshipCertificate">Citizenship certificate (JPEG or PDF)</FormLabel>
                  <FormControl>
                    <Input
                      id="citizenshipCertificate"
                      type="file"
                      accept="image/jpeg,application/pdf"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        field.onChange(e.target.files ?? null);
                      }}
                      ref={field.ref as React.LegacyRef<HTMLInputElement>}
                      aria-invalid={hasErrorAt(field.name)}
                    />
                  </FormControl>
                  <div className="text-sm text-muted-foreground mt-1">
                    {field.value && field.value.length > 0 ? `Selected file: ${field.value[0].name}` : "No file selected"}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="agreeToDeclaration"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3">
                  <FormControl>
                    <Checkbox checked={Boolean(field.value)} onCheckedChange={(v) => field.onChange(Boolean(v))} aria-invalid={hasErrorAt(field.name)} />
                  </FormControl>
                  <div className="flex-1">
                    <FormLabel className="mb-0">I declare that the information and document provided are true and correct.</FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={goBack} disabled={step === 0 || loading}>
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button type="button" onClick={goNext} disabled={loading}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit application"}</Button>
            )}
          </div>

          <div>
            <Button type="button" variant="ghost" onClick={() => form.reset()} disabled={loading}>
              Reset
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
