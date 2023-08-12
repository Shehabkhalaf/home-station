<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AccessController extends Controller
{
    use ApiResponse;
    public function login(Request $request)
    {
        if ($request->username == 'admin@homestation.com' && $request->password == 'i4GFC5XATWIdVaMayk9UFy6WXg2j9k') {
            return $this->JsonResponse(201, 'Logged in');
        } else {
            return $this->JsonResponse(401, 'Logging denied');
        }
    }
}
