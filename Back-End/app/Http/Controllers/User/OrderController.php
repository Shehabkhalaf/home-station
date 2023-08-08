<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserOrders;
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
}