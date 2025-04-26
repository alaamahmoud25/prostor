'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { Order } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { useTransition } from 'react';
import { toast } from 'sonner';
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import {
  createPayPalOrder,
  approvePayPalOrder,
  updateOrderToPaidCOD,
  deliverOrder,
} from '@/lib/actions/order.actions';
//import StripePayment from './stripe-payment';

interface Props {
  order: Omit<Order, 'paymentResult'>;
  paypalClientId: string;
  isAdmin: boolean;
  stripeClientSecret: string | null;
}

const OrderDetailsTable = ({
  order,
  paypalClientId,
  isAdmin,
  stripeClientSecret,
}: Props) => {
  const {
    id,
    shippingAddress,
    orderitems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
  } = order;

  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    if (isPending) return 'Loading PayPal...';
    if (isRejected) return 'Error Loading PayPal';
    return '';
  };

  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order.id);
    if (!res.success) toast.error(res.message);
    return res.data;
  };

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order.id, data);
    toast[res.success ? 'success' : 'error'](res.message);
  };

  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition();
    return (
      <Button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await updateOrderToPaidCOD(order.id);
            toast[res.success ? 'success' : 'error'](res.message);
          })
        }
      >
        {isPending ? 'Processing...' : 'Mark As Paid'}
      </Button>
    );
  };

  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition();
    return (
      <Button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await deliverOrder(order.id);
            toast[res.success ? 'success' : 'error'](res.message);
          })
        }
      >
        {isPending ? 'Processing...' : 'Mark As Delivered'}
      </Button>
    );
  };

  return (
    <div>
      <h1 className="py-4 text-2xl">Order {formatId(id)}</h1>

      <div className="grid md:grid-cols-3 md:gap-5">
        {/* Payment Info */}
        <div className="col-span-2 space-y-4">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p>{paymentMethod}</p>
              {isPaid ? (
                <Badge variant="secondary">
                  Paid at {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not Paid</Badge>
              )}
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.streetAddress}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              {isDelivered ? (
                <Badge variant="secondary">
                  Delivered at {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not Delivered</Badge>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl pb-4">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderitems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link href={`/product/${item.slug}`}>{item.name}</Link>
                      </TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {isAdmin && (
            <div className="flex gap-4">
              {!isPaid && <MarkAsPaidButton />}
              {isPaid && !isDelivered && <MarkAsDeliveredButton />}
            </div>
          )}
        </div>

        {/* Stripe or PayPal Integration */}
        <div>
          {paymentMethod === 'PayPal' && paypalClientId && !isPaid && (
            <PayPalScriptProvider options={{ clientId: paypalClientId }}>
              <PayPalButtons
                createOrder={handleCreatePayPalOrder}
                onApprove={handleApprovePayPalOrder}
              />
              <div>{PrintLoadingState()}</div>
            </PayPalScriptProvider>
          )}

          {paymentMethod === 'Stripe' && stripeClientSecret && !isPaid && (
            <StripePayment clientSecret={stripeClientSecret} />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsTable;
