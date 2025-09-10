// @ts-nocheck 
 "use client";

import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormData, FormSchema } from "@/schemas/formSchema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

export function FormComponent() {
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    mode: "onTouched",
  });

  const steps: string[] = ["Applicant", "Contact & Address", "Passport Details"];

  const stepFields: string[][] = [
    ["firstName", "middleName", "lastName", "dateOfBirth", "gender"],
    [
      "email",
      "phone",
      "ssn",
      "address.street",
      "address.city",
      "address.state",
      "address.zip",
      "address.country",
    ],
    ["passportType", "applicationType", "previousPassportNumber", "agreeToDeclaration"],
  ];

  const formatSingleDate = (d?: Date) => (d ? format(d, "PPP") : "Select date");

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
      console.log("Passport application payload:", values);
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
          <h2 className="text-lg font-semibold">US Passport Application</h2>
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
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle name (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Middle name" {...field} aria-invalid={hasErrorAt(field.name)} />
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

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-row gap-4">
                      <label className="flex items-center gap-2">
                        <RadioGroupItem value="Male" />
                        <span>Male</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <RadioGroupItem value="Female" />
                        <span>Female</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <RadioGroupItem value="X" />
                        <span>X</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <RadioGroupItem value="PreferNotToSay" />
                        <span>Prefer not to say</span>
                      </label>
                    </RadioGroup>
                  </FormControl>
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="(555) 555-5555" {...field} aria-invalid={hasErrorAt(field.name)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ssn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Security Number (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="123-45-6789" {...field} aria-invalid={hasErrorAt(field.name)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-2">
              <div className="text-sm font-medium">Mailing address</div>

              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} aria-invalid={hasErrorAt(field.name)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} aria-invalid={hasErrorAt(field.name)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} aria-invalid={hasErrorAt(field.name)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP</FormLabel>
                      <FormControl>
                        <Input placeholder="12345" {...field} aria-invalid={hasErrorAt(field.name)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="United States" {...field} aria-invalid={hasErrorAt(field.name)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="passportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passport product</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Book">Passport Book</SelectItem>
                          <SelectItem value="Card">Passport Card</SelectItem>
                          <SelectItem value="BookAndCard">Book + Card</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select application type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Renewal">Renewal</SelectItem>
                          <SelectItem value="Replacement">Replacement</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="previousPassportNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Previous passport number (if any)</FormLabel>
                  <FormControl>
                    <Input placeholder="Previous passport #" {...field} aria-invalid={hasErrorAt(field.name)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agreeToDeclaration"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3">
                  <FormControl>
                    <Checkbox checked={Boolean(field.value)} onCheckedChange={(v) => field.onChange(Boolean(v))} aria-invalid={hasErrorAt(field.name)} />
                  </FormControl>
                  <div className="flex-1">
                    <FormLabel className="mb-0">I declare under penalty of perjury that the information provided is true and correct.</FormLabel>
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
