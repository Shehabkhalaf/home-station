<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminOrders;
use App\Models\AdminOrder;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    use ApiResponse;
    public function undeliveredOrders()
    {
        $orders = AdminOrders::collection(AdminOrder::where('status', 'no')->get());
        return $this->JsonResponse(200, '', $orders);
    }
    public function deliverOrder($id)
    {
        $order = AdminOrder::find($id);
        $order->status = 'delivered';
        $delivered = $order->save();
        return $delivered ? $this->JsonResponse(200, 'Order Delivered', $order) : $this->JsonResponse(500, 'Nothinf happened');
    }
    public function deliveredOrders()
    {
        $orders = AdminOrders::collection(AdminOrder::where('status', 'delivered')->get());
        return $this->JsonResponse(200, 'Delivered Orders', $orders);
    }
}
