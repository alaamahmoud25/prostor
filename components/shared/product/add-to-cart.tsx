'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Minus, Loader } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Cart, CartItem } from '@/types';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';

type AddToCartProps = {
  cart?: Cart;
  item: CartItem;
};

const AddToCart = ({ cart, item }: AddToCartProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // ✅ إضافة المنتج إلى السلة
  const handleAddToCart = () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error(res.message); // ❌ في حالة الخطأ
        return;
      }

      toast(res.message, {
        action: {
          label: 'Go To Cart',
          onClick: () => router.push('/cart'),
        },
      });
    });
  };

  // ❌ إزالة المنتج من السلة
  const handleRemoveFromCart = () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  // ✅ التحقق هل المنتج موجود في السلة بالفعل
  const existItem = cart?.items.find((x) => x.productId === item.productId);

  // ✅ إذا كان المنتج موجود، عرض زر + و -
  if (existItem) {
    return (
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleRemoveFromCart}
          disabled={isPending}
        >
          {isPending ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Minus className="w-4 h-4" />
          )}
        </Button>

        <span className="px-2">{existItem.qty}</span>

        <Button
          type="button"
          variant="outline"
          onClick={handleAddToCart}
          disabled={isPending}
        >
          {isPending ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </Button>
      </div>
    );
  }

  // ✅ إذا المنتج غير موجود، عرض زر "Add to Cart"
  return (
    <Button
      className="w-full"
      type="button"
      onClick={handleAddToCart}
      disabled={isPending}
    >
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
      Add To Cart
    </Button>
  );
};

export default AddToCart;
