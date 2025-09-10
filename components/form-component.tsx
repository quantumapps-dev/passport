"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormData, FormSchema } from "@/schemas/formSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function FormComponent() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      address: {
        line1: "",
        line2: "",
        street: "",
        city: "",
        state: "",
        country: "United States",
        zipCode: "",
      },
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);
    setIsSubmitted(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    reset();
    setIsSubmitted(false);
  };

  const formData = watch();

  return (
    <div className={`transition-all duration-300 w-full`}>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Registration Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter your full legal name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="name@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Address Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Address Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="line1">Address Line 1 *</Label>
                  <Input
                    id="line1"
                    {...register("address.line1")}
                    placeholder="123 Main Street"
                    className={errors.address?.line1 ? "border-red-500" : ""}
                  />
                  {errors.address?.line1 && (
                    <p className="text-sm text-red-500">{errors.address.line1.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="line2">Address Line 2</Label>
                  <Input
                    id="line2"
                    {...register("address.line2")}
                    placeholder="Apartment, suite, unit, or floor (optional)"
                    className={errors.address?.line2 ? "border-red-500" : ""}
                  />
                  {errors.address?.line2 && (
                    <p className="text-sm text-red-500">{errors.address.line2.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="street">Street *</Label>
                  <Input
                    id="street"
                    {...register("address.street")}
                    placeholder="Main Street"
                    className={errors.address?.street ? "border-red-500" : ""}
                  />
                  {errors.address?.street && (
                    <p className="text-sm text-red-500">{errors.address.street.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    {...register("address.city")}
                    placeholder="San Francisco"
                    className={errors.address?.city ? "border-red-500" : ""}
                  />
                  {errors.address?.city && (
                    <p className="text-sm text-red-500">{errors.address.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    {...register("address.state")}
                    placeholder="California"
                    className={errors.address?.state ? "border-red-500" : ""}
                  />
                  {errors.address?.state && (
                    <p className="text-sm text-red-500">{errors.address.state.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    {...register("address.country")}
                    value="United States"
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    {...register("address.zipCode")}
                    placeholder="94103 or 94103-1234"
                    className={errors.address?.zipCode ? "border-red-500" : ""}
                  />
                  {errors.address?.zipCode && (
                    <p className="text-sm text-red-500">{errors.address.zipCode.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : isSubmitted ? "Submitted!" : "Submit Form"}
              </Button>
            </div>
          </form>

          {/* Form Data Preview for Development */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 p-4 bg-gray-50 rounded-lg">
              <summary className="cursor-pointer font-medium">Form Data (Dev Only)</summary>
              <pre className="mt-2 text-xs overflow-x-auto">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
