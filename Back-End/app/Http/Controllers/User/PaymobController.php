<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


class PaymobController extends Controller
{
    public function state(Request $request)
    {
        $success = $request->obj->success;
        if ($success == 'true') {
            return
                redirect('http://127.0.0.1:5501/payment.html')->with('status', 200);
        } else {
            return
                redirect('http://127.0.0.1:5501/payment.html')->with('status', 400);
        }
    }
}
