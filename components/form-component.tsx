// @ts-nocheck 
 "use client";

import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormData, FormSchema } from "@/schemas/formSchema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export function FormComponent() {
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    mode: "onTouched",
  });

  const spouseFieldArray = useFieldArray<FormData, "spouseNames">({ control: form.control, name: "spouseNames" as const });
  const childrenFieldArray = useFieldArray<FormData, "childrenNames">({ control: form.control, name: "childrenNames" as const });

  const steps: string[] = ["Applicant", "Family & Children", "Contact"];

  const stepFields: string[][] = [
    ["firstName", "lastName", "dateOfBirth"],
    ["hasSpouse", "spouseNames", "hasChildren", "childrenNames"],
    ["email", "phone"],
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
      console.log("Applicant form payload:", values);
      await new Promise((r) => setTimeout(r, 700));
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
          <h2 className="text-lg font-semibold">Applicant & Family Information</h2>
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
              name="hasSpouse"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3">
                  <FormControl>
                    <Checkbox checked={Boolean(field.value)} onCheckedChange={(v) => field.onChange(Boolean(v))} aria-invalid={hasErrorAt(field.name)} />
                  </FormControl>
                  <div className="flex-1">
                    <FormLabel className="mb-0">Do you have a spouse?</FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {form.getValues("hasSpouse") && (
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Spouse names</div>
                  <Button type="button" onClick={() => spouseFieldArray.append({ name: "" })} disabled={loading}>
                    Add spouse
                  </Button>
                </div>

                {spouseFieldArray.fields.length === 0 && (
                  <div className="text-sm text-muted-foreground">No spouse names added yet.</div>
                )}

                {spouseFieldArray.fields.map((item, index) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={`spouseNames.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Input placeholder={`Spouse #${index + 1} full name`} {...field} aria-invalid={hasErrorAt(field.name)} />
                        </FormControl>
                        <div>
                          <Button type="button" variant="destructive" onClick={() => spouseFieldArray.remove(index)}>
                            Remove
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            )}

            <FormField
              control={form.control}
              name="hasChildren"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3">
                  <FormControl>
                    <Checkbox checked={Boolean(field.value)} onCheckedChange={(v) => field.onChange(Boolean(v))} aria-invalid={hasErrorAt(field.name)} />
                  </FormControl>
                  <div className="flex-1">
                    <FormLabel className="mb-0">Do you have children?</FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {form.getValues("hasChildren") && (
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Children names</div>
                  <Button type="button" onClick={() => childrenFieldArray.append({ name: "" })} disabled={loading}>
                    Add child
                  </Button>
                </div>

                {childrenFieldArray.fields.length === 0 && (
                  <div className="text-sm text-muted-foreground">No children names added yet.</div>
                )}

                {childrenFieldArray.fields.map((item, index) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={`childrenNames.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Input placeholder={`Child #${index + 1} full name`} {...field} aria-invalid={hasErrorAt(field.name)} />
                        </FormControl>
                        <div>
                          <Button type="button" variant="destructive" onClick={() => childrenFieldArray.remove(index)}>
                            Remove
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
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
              <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit form"}</Button>
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
