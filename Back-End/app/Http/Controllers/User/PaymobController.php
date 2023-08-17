<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Paymob;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;


class PaymobController extends Controller
{
    use ApiResponse;
    public function responseCallback(Request $request)
    {
        $order_id = $request->order;
        $trasction_id = $request->id;
        $pending = $request->pending;
        $success = $request->success;
        $paymob = new Paymob;
        $paymob->order_id = $order_id;
        $paymob->transction_id = $trasction_id;
        $paymob->success = $success;
        $paymob->pending = $pending;
        $saved = $paymob->save();
        if ($saved) {
            return redirect('http://127.0.0.1:5501/payment.html?order_id=' . $order_id);
        } else {
            return abort(404);
        }
    }
    public function payDetails(Request $request)
    {
        $order_id = $request->order_id;
        $paymob = Paymob::where('order_id', '=', $order_id)->first();
        $success['success'] = $paymob->success;
        if ($paymob) {
            return $this->JsonResponse(200, 'Here is the order details', $success);
        } else {
            return $this->JsonResponse(402, 'No content');
        }
    }
}