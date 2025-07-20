
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { PlusCircle } from "lucide-react"
import toast from "react-hot-toast"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { leadsAPI } from "@/lib/leads"

const formSchema = z.object({
  leadName: z.string().min(2, "Lead name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 digits.").max(10, "Phone number must be at most 10 digits."),
  dealValue: z.coerce.number().positive("Deal value must be a positive number."),
  stage: z.enum(["New", "In Progress", "Qualified", "Closed"]),
  lastInteraction: z.string().min(5, "Please describe the last interaction."),
  additionalDetails: z.string().optional(),
})

export function SingleLeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leadName: "",
      email: "",
      phone: "",
      dealValue: 0,
      stage: "New",
      lastInteraction: "",
      additionalDetails: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    
    try {
      const response = await leadsAPI.createSingleLead({
        ...values,
        contactDetails: values.email, 
      })
      
      if (response.success) {
        toast.success(
          <div>
            <p className="font-bold">Lead Created Successfully!</p>
            <p>{values.leadName} has been added to your leads.</p>
          </div>,
          {
            duration: 4000,
            position: "top-center",
          }
        )
        form.reset()
      } else {
        throw new Error(response.error || "Failed to create lead")
      }
    } catch (error) {
      toast.error(
        <div>
          <p className="font-bold">Error Creating Lead</p>
          <p>{error instanceof Error ? error.message : "An unknown error occurred"}</p>
        </div>,
        {
          duration: 4000,
          position: "top-center",
        }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a Single Lead</CardTitle>
        <CardDescription>Fill out the form below to add a new lead.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="leadName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Doe" {...field} />
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
                  <FormLabel>Contact Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 9876543211" {...field} />
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
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., jane.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dealValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deal Value ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Qualified">Qualified</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="lastInteraction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Interaction</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the last contact..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Details (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any other relevant info..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {isSubmitting ? "Creating Lead..." : "Add Lead"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}