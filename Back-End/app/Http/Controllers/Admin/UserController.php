<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponse;

class UserController extends Controller
{
    use ApiResponse;
    public function allUsers()
    {
        $users = User::all();
        $data = [
            'count' => $users->count(),
            'users' => $users
        ];
        if ($data) {
            return $this->JsonResponse(200, 'Users are here', $data);
        } else {
            $this->JsonResponse(200, 'No available users', $data);
        }
    }
}
