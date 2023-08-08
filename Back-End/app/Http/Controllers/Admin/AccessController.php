<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AccessController extends Controller
{
    use ApiResponse;
    public function permitted()
    {
        return $this->JsonResponse(200, 'Access accepted');
    }
}