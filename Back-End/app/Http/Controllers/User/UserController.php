<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    use ApiResponse;
    public function index()
    {
        $user = auth()->user();
        return $this->JsonResponse(200, 'Worked', $user);
    }
    public function allProducts()
    {
        $product = new ProductController;
        return $product->getCategoriesWithProducts();
    }
    public function updateData(Request $request)
    {
        $user = auth()->user();
        $user = User::find($user->id);
        $user->name = $request->input('name');
        $user->address = $request->input('location');
        $user->phone = $request->input('phone');
        $user->password = $request->input('password');
        $updated = $user->save();
        if ($updated) {
            return $this->JsonResponse(201, 'Updated', $user);
        } else {
            return $this->JsonResponse(500, 'Error');
        }
    }
    public function contactUs(Request $request)
    {
        $message = Message::create($request->all());
        return $this->JsonResponse(201, 'Message Sent', $message);
    }
}