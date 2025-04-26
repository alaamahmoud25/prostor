'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, ControllerRenderProps } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import slugify from 'slugify';

// Schemas and Types
import { productDefaultValues } from '@/lib/constants';
import { insertProductSchema, updateProductSchema } from '@/lib/validators';
import type { Product } from '@/types';

// UI Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';

// Actions and Upload
import { createProduct, updateProduct} from '@/lib/actions/product-actions';
import { UploadButton } from '@/lib/uploadthing';

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: 'Create' | 'Update';
  product?: Product;
  productId?: string;
}) => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver:
      type === 'Update'
        ? zodResolver(updateProductSchema)
        : zodResolver(insertProductSchema),
    defaultValues:
      product && type === 'Update' ? product : productDefaultValues,
  });

  const onSubmit = async (values: z.infer<typeof insertProductSchema>) => {
    try {
      if (type === 'Create') {
        const res = await createProduct(values);
        if (!res.success) throw new Error(res.message);
        toast.success(res.message);
        router.push('/admin/products');
      }

      if (type === 'Update' && productId) {
        const res = await updateProduct({ ...values, id: productId });
        if (!res.success) throw new Error(res.message);
        toast.success(res.message);
        router.push('/admin/products');
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const images = form.watch('images') || [];
  const isFeatured = form.watch('isFeatured');
  const banner = form.watch('banner');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
        {/* Basic Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'name'
              >;
            }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'slug'
              >;
            }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input placeholder="product-slug" {...field} />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        form.setValue(
                          'slug',
                          slugify(form.getValues('name'), { lower: true })
                        )
                      }
                    >
                      Generate
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Category & Brand Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'category'
              >;
            }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Product category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'brand'
              >;
            }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Product brand" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Pricing & Stock Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'price'
              >;
            }) => (
              <FormItem>
                <FormLabel>Price </FormLabel>
                <FormControl>
                  <Input placeholder="Enter product price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'stock'
              >;
            }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input placeholder="Enter stock" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Product Images Section */}
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Product Images</FormLabel>
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex flex-wrap gap-4">
                    {images.map((image) => (
                      <Image
                        key={image}
                        src={image}
                        alt="Product image"
                        width={120}
                        height={120}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ))}
                    <FormControl>
                      <UploadButton
                        endpoint="imageUploader"
                        onUploadBegin={() => {
                          setIsUploading(true);
                          toast.loading('Uploading image...');
                        }}
                        onClientUploadComplete={(res: { url: string }[]) => {
                          form.setValue('images', [...images, res[0].url]);
                        }}
                        onUploadError={(error) => {
                          setIsUploading(false);
                          toast.dismiss();
                          toast.error(`Upload failed: ${error.message}`);
                        }}
                        className="ut-button:bg-primary ut-button:text-white"
                        disabled={isUploading}
                      />
                    </FormControl>
                  </div>
                </CardContent>
              </Card>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Featured Product Section */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                  </FormControl>
                  <FormLabel>Feature this product</FormLabel>
                </FormItem>
              )}
            />

            {isFeatured && (
              <div className="space-y-4">
                {banner ? (
                  <Image
                    src={banner}
                    alt="banner image"
                    className="w-full object-cover object-center rounded-sm"
                    width={1920}
                    height={680}
                  />
                ) : (
                  <UploadButton
                    endpoint="imageUploader"
                    onUploadBegin={() => {
                      setIsUploading(true);
                      toast.loading('Uploading banner...');
                    }}
                    onClientUploadComplete={(res: { url: string }[]) => {
                      form.setValue('banner', res[0].url);
                    }}
                    onUploadError={(error) => {
                      setIsUploading(false);
                      toast.dismiss();
                      toast.error(`Banner upload failed: ${error.message}`);
                    }}
                    className="ut-button:bg-primary ut-button:text-white"
                    disabled={isUploading}
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Description */}
        <FormField
          control={form.control}
          name="description"
          render={({
            field,
          }: {
            field: ControllerRenderProps<
              z.infer<typeof insertProductSchema>,
              'description'
            >;
          }) => (
            <FormItem>
              <FormLabel>Product Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your product..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting || isUploading}
          className="w-full"
        >
          {form.formState.isSubmitting || isUploading
            ? 'Submitting'
            : `${type} Product`}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;
