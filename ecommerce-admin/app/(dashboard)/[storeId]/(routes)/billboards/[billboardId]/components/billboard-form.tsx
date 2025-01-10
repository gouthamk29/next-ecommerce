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
import { Billboard } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { revalidatePath } from "next/cache";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface BillboardFormProps {
  initialData: Billboard | null;
}

const formScherma = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

type BillboardFormValue = z.infer<typeof formScherma>;

export const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit BillBoard" : "Create Billboard";
  const description = initialData ? "Edit a BillBoard" : "Add a new Billboard";
  const toastMessage = initialData ? "BillBoard updated" : "Billboard created";
  const action = initialData ? "Save changes?" : "Create a billboard?";

  const form = useForm<BillboardFormValue>({
    resolver: zodResolver(formScherma),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: BillboardFormValue) => {
    try {
      setLoading(true);
      if (initialData)
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      //Refresh the server component, so after submitting stale data can be re-fetched
      // router.refresh();
      router.push(`/${params.storeId}/billboards`);
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
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      //Refresh the server component, so after submitting stale data can be re-fetched
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success("billboard deleted");
    } catch (error) {
      toast.error("Make sure you removed all categories using this billboard");
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard label"
                      {...field}
                    />
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
