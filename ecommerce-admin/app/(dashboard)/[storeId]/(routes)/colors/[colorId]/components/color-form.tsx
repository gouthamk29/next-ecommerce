"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { revalidatePath } from "next/cache";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ColorFormProps {
  initialData: Color | null;
}

const formScherma = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: "String must be valid Hex Code",
  }),
});

type ColorFormValue = z.infer<typeof formScherma>;

export const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Color" : "Create Color";
  const description = initialData ? "Edit a Color" : "Add a new Color";
  const toastMessage = initialData ? "Color updated" : "Color created";
  const action = initialData ? "Save changes?" : "Create a Color?";

  const form = useForm<ColorFormValue>({
    resolver: zodResolver(formScherma),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: ColorFormValue) => {
    try {
      setLoading(true);
      if (initialData)
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          data
        );
      else {
        await axios.post(`/api/${params.storeId}/colors`, data);
      }
      //Refresh the server component, so after submitting stale data can be re-fetched
      // router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast.success(toastMessage);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      //Refresh the server component, so after submitting stale data can be re-fetched
      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast.success("size deleted");
    } catch (error) {
      toast.error("Make sure you removed all products using this color");
    } finally {
      // revalidatePath(`/${params.storeId}`);
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData && (
          <Button
            variant="destructive"
            disabled={loading}
            size="sm"
            onClick={() => {
              setOpen(true);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Color name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={loading}
                        placeholder="Color value"
                        {...field}
                      />
                      <div
                        className="border p-4 rounded-full antialiased"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto " type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};
