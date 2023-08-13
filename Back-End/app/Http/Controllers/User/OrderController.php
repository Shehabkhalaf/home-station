<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserOrders;
use App\Models\AdminOrder;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    use ApiResponse;
    public function allOrders()
    {
        $user = User::find(auth()->user()->id);
        $orders = UserOrders::collection($user->orders);
        return $this->JsonResponse(200, 'User orders', $orders);
    }
    public function makeOrder(Request $request)
    {
        $user = User::find(auth()->user()->id);
        $user_id = $user->id;
        $user_data = 'name:' . $user->name . '<br>' . 'email:' . $user->email . '<br>' . 'phone:' . $user->phone . '<br>' . 'location:' . $user->address;
        $order = new Order;
        $order->user_id = $user_id;
        $order->order_details = $request->order_details;
        $order->total_price = $request->total_price;
        $order->paid = $request->paid_method;
        $order->promocode = $request->has('promocode') ? $request->promocode : 'nothing';
        $UserOrdered = $order->save();
        $products = $request->products;
        foreach ($products as $product) {
            $product_id = $product['product_id'];
            $product_data = Product::find($product_id);
            $product_data->stock = ($product_data->stock) - ($product['amount']);
            $product_data->save();
        }
        $adminOrder = new AdminOrder;
        $adminOrder->user_data = $user_data;
        $adminOrder->order_details = $request->order_details;
        $adminOrder->total_price = $request->total_price;
        $adminOrder->promocode = $order->promocode;
        $adminOrder->paid = $request->paid_method;
        $adminOrders = $adminOrder->save();
        if ($UserOrdered && $adminOrders) {
            return $this->JsonResponse(200, 'Order Done', $UserOrdered);
        } else {
            return $this->JsonResponse(500, 'Somethin went wrong');
        }
    }
}
